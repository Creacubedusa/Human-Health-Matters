import { BadRequestException, Body, Controller, Get, Patch, Req, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import type { Request } from 'express';
import { JwtAuthGuard } from '../../common/auth/jwt-auth.guard';
import { Roles } from '../../common/auth/roles.decorator';
import type { JwtPayload } from '../../common/auth/auth.types';
import { PrismaService } from '../../prisma/prisma.service';
import { DoctorProfileSetupDto } from './dto/doctor-profile-setup.dto';
import { UpdateDoctorAvailabilityDto } from './dto/update-doctor-availability.dto';
import { UpdateDoctorProfileDto } from './dto/update-doctor-profile.dto';

@ApiTags('doctor')
@Controller('doctor')
export class DoctorController {
  constructor(private readonly prisma: PrismaService) {}

  private validateAvailabilityPayload(body: UpdateDoctorAvailabilityDto) {
    if (body.toDate < body.fromDate) {
      throw new BadRequestException('availability_invalid_date_range');
    }

    const allowedDurations = new Set([15, 30, 45, 60]);
    if (!allowedDurations.has(body.appointmentDurationMinutes)) {
      throw new BadRequestException('availability_invalid_duration');
    }

    const seenDays = new Set<string>();
    for (const day of body.days) {
      if (seenDays.has(day.key)) {
        throw new BadRequestException('availability_duplicate_day');
      }
      seenDays.add(day.key);

      const ordered = [...day.slots].sort((left, right) =>
        left.startTime.localeCompare(right.startTime),
      );

      for (let index = 0; index < ordered.length; index += 1) {
        const slot = ordered[index];
        if (!/^\d{2}:\d{2}$/.test(slot.startTime) || !/^\d{2}:\d{2}$/.test(slot.endTime)) {
          throw new BadRequestException('availability_invalid_time_format');
        }
        if (slot.endTime <= slot.startTime) {
          throw new BadRequestException('availability_invalid_time_range');
        }
        if (index > 0 && ordered[index - 1].endTime > slot.startTime) {
          throw new BadRequestException('availability_overlapping_slots');
        }
      }
    }
  }

  @Get('dashboard')
  @UseGuards(JwtAuthGuard)
  @Roles('DOCTOR')
  async dashboard(@Req() req: Request & { user?: JwtPayload }) {
    const doctorId = req.user?.sub;
    if (!doctorId) throw new Error('missing_user');

    const now = new Date();

    const [user, profile, pendingConsultations, allAppointments, recentAppts] =
      await Promise.all([
        this.prisma.user.findUnique({
          where: { id: doctorId },
          select: { firstName: true, lastName: true },
        }),
        this.prisma.doctorProfile.findUnique({
          where: { userId: doctorId },
          select: { onboardingCompletedAt: true },
        }),
        this.prisma.appointment.count({
          where: {
            doctorId,
            status: 'UPCOMING',
            startsAt: { gte: now },
          },
        }),
        this.prisma.appointment.findMany({
          where: {
            doctorId,
          },
          select: { id: true, patientId: true },
          take: 500,
        }),
        this.prisma.appointment.findMany({
          where: { doctorId },
          include: {
            patient: { select: { id: true, firstName: true, lastName: true } },
          },
          take: 20,
          orderBy: { startsAt: 'desc' },
        }),
      ]);

    const doctorName = [user?.firstName, user?.lastName].filter(Boolean).join(' ');
    const onboardingStatus = profile?.onboardingCompletedAt ? 'complete' : 'incomplete';

    const patientIds = new Set(allAppointments.map((a) => a.patientId));

    const recentPatientsMap = new Map<
      string,
      { id: string; name: string; lastVisit: string }
    >();
    for (const a of recentAppts) {
      recentPatientsMap.set(a.patient.id, {
        id: a.patient.id,
        name: [a.patient.firstName, a.patient.lastName].filter(Boolean).join(' '),
        lastVisit: a.startsAt.toISOString(),
      });
      if (recentPatientsMap.size >= 5) break;
    }

    return {
      doctorName,
      onboardingStatus,
      pendingConsultations,
      weeklyStats: {
        consultations: allAppointments.length,
        patients: patientIds.size,
      },
      recentPatients: Array.from(recentPatientsMap.values()),
    };
  }

  @Get('patients')
  @UseGuards(JwtAuthGuard)
  @Roles('DOCTOR')
  async patients(@Req() req: Request & { user?: JwtPayload }) {
    const doctorId = req.user?.sub;
    if (!doctorId) throw new Error('missing_user');

    const appts = await this.prisma.appointment.findMany({
      where: { doctorId },
      include: {
        patient: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            patientProfile: { select: { profileData: true } },
          },
        },
      },
      take: 200,
      orderBy: { createdAt: 'desc' },
    });

    const map = new Map<
      string,
      {
        id: string;
        name: string;
        lastVisit: string;
        avatarUri: string | null;
      }
    >();
    for (const a of appts) {
      if (map.has(a.patient.id)) continue;
      const profileData = a.patient.patientProfile?.profileData as
        | Record<string, unknown>
        | null
        | undefined;
      const avatarUri =
        profileData &&
        typeof profileData === 'object' &&
        typeof (profileData as { avatarUri?: unknown }).avatarUri === 'string'
          ? ((profileData as { avatarUri?: string }).avatarUri ?? null)
          : null;
      map.set(a.patient.id, {
        id: a.patient.id,
        name: [a.patient.firstName, a.patient.lastName]
          .filter(Boolean)
          .join(' '),
        lastVisit: a.startsAt.toISOString(),
        avatarUri,
      });
    }

    return Array.from(map.values());
  }

  @Get('patients/:patientId')
  @UseGuards(JwtAuthGuard)
  @Roles('DOCTOR')
  async patientProfile(@Req() req: Request & { user?: JwtPayload }) {
    const doctorId = req.user?.sub;
    if (!doctorId) throw new Error('missing_user');
    const patientId = req.params.patientId as string;

    const has = await this.prisma.appointment.findFirst({
      where: { doctorId, patientId },
      select: { id: true },
    });
    if (!has) throw new Error('forbidden');

    const patient = await this.prisma.user.findUnique({
      where: { id: patientId },
      select: { id: true, firstName: true, lastName: true },
    });

    const profile = await this.prisma.patientProfile.findUnique({
      where: { userId: patientId },
      select: { profileData: true },
    });

    return { patient, profile: profile?.profileData ?? null };
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @Roles('DOCTOR')
  async profile(@Req() req: Request & { user?: JwtPayload }) {
    const doctorId = req.user?.sub;
    if (!doctorId) throw new Error('missing_user');

    const user = await this.prisma.user.findUnique({
      where: { id: doctorId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phoneCountryCode: true,
        phone: true,
      },
    });

    const profile = await this.prisma.doctorProfile.findUnique({
      where: { userId: doctorId },
      select: {
        specialties: true,
        bio: true,
        avatarUri: true,
        availabilitySettings: true,
        availabilitySetAt: true,
        medicalCertificate: true,
        boardCertificate: true,
        deaRegistration: true,
        malpracticeInsurance: true,
        onboardingCompletedAt: true,
      },
    });

    return { user, profile };
  }

  @Get('availability')
  @UseGuards(JwtAuthGuard)
  @Roles('DOCTOR')
  async availability(@Req() req: Request & { user?: JwtPayload }) {
    const doctorId = req.user?.sub;
    if (!doctorId) throw new Error('missing_user');

    const profile = await this.prisma.doctorProfile.findUnique({
      where: { userId: doctorId },
      select: {
        availabilitySettings: true,
        availabilitySetAt: true,
      },
    });

    return {
      settings: profile?.availabilitySettings ?? null,
      hasAvailability: Boolean(profile?.availabilitySetAt),
      availabilitySetAt: profile?.availabilitySetAt ?? null,
    };
  }

  @Patch('availability')
  @UseGuards(JwtAuthGuard)
  @Roles('DOCTOR')
  async updateAvailability(
    @Req() req: Request & { user?: JwtPayload },
    @Body() body: UpdateDoctorAvailabilityDto,
  ) {
    const doctorId = req.user?.sub;
    if (!doctorId) throw new Error('missing_user');
    this.validateAvailabilityPayload(body);

    const profile = await this.prisma.doctorProfile.update({
      where: { userId: doctorId },
      data: {
        availabilitySettings: body as unknown as Prisma.InputJsonValue,
        availabilitySetAt: new Date(),
      },
      select: {
        availabilitySettings: true,
        availabilitySetAt: true,
      },
    });

    return {
      settings: profile.availabilitySettings,
      hasAvailability: Boolean(profile.availabilitySetAt),
      availabilitySetAt: profile.availabilitySetAt,
    };
  }

  @Patch('profile')
  @UseGuards(JwtAuthGuard)
  @Roles('DOCTOR')
  async updateProfile(
    @Req() req: Request & { user?: JwtPayload },
    @Body() body: UpdateDoctorProfileDto,
  ) {
    const doctorId = req.user?.sub;
    if (!doctorId) throw new Error('missing_user');

    const profile = await this.prisma.doctorProfile.update({
      where: { userId: doctorId },
      data: {
        specialties: body.specialties,
        bio: body.bio === undefined ? undefined : body.bio ?? null,
        avatarUri: body.avatarUri === undefined ? undefined : body.avatarUri ?? null,
        medicalCertificate:
          body.medicalCertificate === undefined ? undefined : body.medicalCertificate ?? null,
        boardCertificate:
          body.boardCertificate === undefined ? undefined : body.boardCertificate ?? null,
        deaRegistration:
          body.deaRegistration === undefined ? undefined : body.deaRegistration ?? null,
        malpracticeInsurance:
          body.malpracticeInsurance === undefined ? undefined : body.malpracticeInsurance ?? null,
      },
      select: {
        specialties: true,
        bio: true,
        avatarUri: true,
        availabilitySettings: true,
        availabilitySetAt: true,
        medicalCertificate: true,
        boardCertificate: true,
        deaRegistration: true,
        malpracticeInsurance: true,
        onboardingCompletedAt: true,
      },
    });

    return { profile };
  }

  @Patch('profile/setup')
  @UseGuards(JwtAuthGuard)
  @Roles('DOCTOR')
  async setupProfile(
    @Req() req: Request & { user?: JwtPayload },
    @Body() body: DoctorProfileSetupDto,
  ) {
    const doctorId = req.user?.sub;
    if (!doctorId) throw new Error('missing_user');

    const profile = await this.prisma.doctorProfile.update({
      where: { userId: doctorId },
      data: {
        specialties: body.specialties,
        bio: body.bio ?? null,
        avatarUri: body.avatarUri ?? null,
        onboardingCompletedAt: new Date(),
      },
      select: {
        specialties: true,
        bio: true,
        avatarUri: true,
        availabilitySettings: true,
        availabilitySetAt: true,
        medicalCertificate: true,
        boardCertificate: true,
        deaRegistration: true,
        malpracticeInsurance: true,
        onboardingCompletedAt: true,
      },
    });

    return { profile };
  }
}
