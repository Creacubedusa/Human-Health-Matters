import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { DailyClient } from './daily/daily.client';
import { ConfigService } from '@nestjs/config';
import { Role, VideoSessionStatus } from '@prisma/client';

@Injectable()
export class VideoService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly daily: DailyClient,
    private readonly config: ConfigService,
  ) {}

  async joinAppointmentVideo(args: {
    appointmentId: string;
    userId: string;
    role: Role;
  }) {
    const appt = await this.prisma.appointment.findUnique({
      where: { id: args.appointmentId },
      include: {
        patient: { select: { id: true, firstName: true, lastName: true } },
        doctor: { select: { id: true, firstName: true, lastName: true } },
        videoSession: true,
      },
    });
    if (!appt) throw new BadRequestException('appointment_not_found');

    const can = appt.patientId === args.userId || appt.doctorId === args.userId;
    if (!can) throw new ForbiddenException('forbidden');

    const now = Date.now();
    const earlySeconds = this.intEnv('VIDEO_JOIN_EARLY_SECONDS', 10 * 60);
    const lateSeconds = this.intEnv('VIDEO_JOIN_LATE_SECONDS', 60 * 60);
    const windowStart = appt.startsAt.getTime() - earlySeconds * 1000;
    const windowEnd = appt.endsAt.getTime() + lateSeconds * 1000;
    if (now < windowStart) throw new BadRequestException('too_early_to_join');
    if (now > windowEnd) throw new BadRequestException('too_late_to_join');

    const roomName = this.roomNameForAppointment(appt.id);
    const session =
      appt.videoSession ??
      (await this.ensureDailyRoom({ appointmentId: appt.id, roomName }));

    const tokenTtlSeconds = this.intEnv('VIDEO_TOKEN_TTL_SECONDS', 10 * 60);
    const exp = Math.floor((Date.now() + tokenTtlSeconds * 1000) / 1000);

    const userName =
      args.userId === appt.doctorId
        ? `${appt.doctor.firstName} ${appt.doctor.lastName}`
        : `${appt.patient.firstName} ${appt.patient.lastName}`;

    const isOwner = args.role === 'DOCTOR';
    const { token } = await this.daily.createMeetingToken({
      roomName: session.roomName,
      exp,
      userId: args.userId,
      userName,
      isOwner,
    });

    return {
      appointmentId: appt.id,
      roomName: session.roomName,
      roomUrl: session.roomUrl,
      token,
      expiresAt: new Date(exp * 1000).toISOString(),
    };
  }

  async markActiveByRoomName(roomName: string) {
    const session = await this.prisma.videoSession.findUnique({
      where: { roomName },
    });
    if (!session) return;

    await this.prisma.videoSession.update({
      where: { id: session.id },
      data: {
        status: VideoSessionStatus.ACTIVE,
        startedAt: session.startedAt ?? new Date(),
        endedAt: null,
      },
    });
  }

  async markEndedByRoomName(roomName: string) {
    const session = await this.prisma.videoSession.findUnique({
      where: { roomName },
    });
    if (!session) return;

    await this.prisma.videoSession.update({
      where: { id: session.id },
      data: {
        status: VideoSessionStatus.ENDED,
        endedAt: new Date(),
      },
    });
  }

  private async ensureDailyRoom(args: {
    appointmentId: string;
    roomName: string;
  }) {
    const existing = await this.daily.getRoom(args.roomName);
    const room =
      existing ??
      (await this.daily.createRoom({
        name: args.roomName,
        privacy: 'private',
        properties: {
          max_participants: 2,
        },
      }));

    return await this.prisma.videoSession.upsert({
      where: { appointmentId: args.appointmentId },
      create: {
        appointmentId: args.appointmentId,
        roomName: room.name,
        roomUrl: room.url,
      },
      update: {
        roomName: room.name,
        roomUrl: room.url,
      },
    });
  }

  private roomNameForAppointment(appointmentId: string) {
    return `appt_${appointmentId}`;
  }

  private intEnv(key: string, fallback: number) {
    const raw = this.config.get<string>(key);
    const n = raw ? Number(raw) : NaN;
    return Number.isFinite(n) ? Math.trunc(n) : fallback;
  }
}
