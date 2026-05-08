import {
  Body,
  BadRequestException,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Prisma, NotificationType, Role } from '@prisma/client';
import { JwtAuthGuard } from '../../common/auth/jwt-auth.guard';
import { PrismaService } from '../../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { Roles } from '../../common/auth/roles.decorator';

function bookingConflictError(error: unknown) {
  if (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === 'P2002'
  ) {
    return new BadRequestException('This time slot has already been booked.');
  }

  return error;
}

@ApiTags('appointments')
@Controller('appointments')
export class AppointmentsController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notifications: NotificationsService,
  ) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async list(@Req() req: any) {
    const userId = req.user?.sub as string | undefined;
    const role = req.user?.role as Role | undefined;
    if (!userId || !role) throw new Error('missing_user');

    const where =
      role === 'DOCTOR'
        ? { doctorId: userId }
        : role === 'PATIENT'
          ? { patientId: userId }
          : { patientId: userId };

    const items = await this.prisma.appointment.findMany({
      where,
      orderBy: { startsAt: 'desc' },
      include: {
        doctor: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            doctorProfile: {
              select: { avatarUri: true, specialties: true },
            },
          },
        },
        patient: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            patientProfile: { select: { profileData: true } },
          },
        },
      },
    });

    const now = Date.now();
    return items.map((item) => {
      const patientProfileData = item.patient?.patientProfile?.profileData as
        | Record<string, unknown>
        | null
        | undefined;

      const patientAvatarUri = (() => {
        if (!patientProfileData || typeof patientProfileData !== 'object') return null;
        const overview =
          (patientProfileData as { profileOverview?: unknown }).profileOverview;
        const fromOverview =
          overview &&
          typeof overview === 'object' &&
          typeof (overview as { avatarUri?: unknown }).avatarUri === 'string'
            ? (overview as { avatarUri?: string }).avatarUri ?? null
            : null;
        const fromTop =
          typeof (patientProfileData as { avatarUri?: unknown }).avatarUri === 'string'
            ? (patientProfileData as { avatarUri?: string }).avatarUri ?? null
            : null;
        return fromOverview ?? fromTop ?? null;
      })();

      const patientAge = (() => {
        if (!patientProfileData || typeof patientProfileData !== 'object') return null;
        const dob = (patientProfileData as { dateOfBirth?: unknown }).dateOfBirth;
        if (typeof dob === 'string') {
          const m1 = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(dob.trim());
          const m3 = /^(\d{2})(\d{2})(\d{4})$/.exec(dob.trim());
          const m2 = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dob.trim());
          let yyyy: number | null = null;
          let mm: number | null = null;
          let dd: number | null = null;
          if (m1) { dd = Number(m1[1]); mm = Number(m1[2]); yyyy = Number(m1[3]); }
          else if (m3) { dd = Number(m3[1]); mm = Number(m3[2]); yyyy = Number(m3[3]); }
          else if (m2) { yyyy = Number(m2[1]); mm = Number(m2[2]); dd = Number(m2[3]); }
          if (yyyy && mm && dd) {
            const today = new Date();
            let age = today.getUTCFullYear() - yyyy;
            const beforeBirthday =
              today.getUTCMonth() < mm - 1 ||
              (today.getUTCMonth() === mm - 1 && today.getUTCDate() < dd);
            if (beforeBirthday) age -= 1;
            if (Number.isFinite(age) && age >= 0 && age <= 130) return age;
          }
        }
        const overview =
          (patientProfileData as { profileOverview?: unknown }).profileOverview;
        if (overview && typeof overview === 'object') {
          const raw = (overview as { age?: unknown }).age;
          if (typeof raw === 'number' && Number.isFinite(raw)) return raw;
          if (typeof raw === 'string') {
            const m = raw.match(/(\d{1,3})/);
            if (m) return Number(m[1]);
          }
        }
        return null;
      })();

      const isPast = item.endsAt.getTime() <= now;
      const computedStatus =
        item.status === 'CANCELLED'
          ? 'CANCELLED'
          : isPast && item.status === 'UPCOMING'
            ? 'COMPLETED'
            : item.status;

      const { patient, ...rest } = item;
      return {
        ...rest,
        status: computedStatus,
        patient: patient
          ? {
              id: patient.id,
              firstName: patient.firstName,
              lastName: patient.lastName,
              avatarUri: patientAvatarUri,
              age: patientAge,
            }
          : null,
      };
    });
  }

  @Post('now')
  @UseGuards(JwtAuthGuard)
  async createNow(@Req() req: any, @Body() body: any) {
    const patientId = req.user?.sub as string | undefined;
    const role = req.user?.role as Role | undefined;
    if (!patientId || !role) throw new Error('missing_user');
    if (role !== 'PATIENT') throw new Error('forbidden');

    const doctorId = body?.doctorId as string;
    if (!doctorId) throw new BadRequestException('doctor_required');

    const doctor = await this.prisma.user.findFirst({
      where: { id: doctorId, role: 'DOCTOR' },
      select: { id: true },
    });
    if (!doctor) throw new BadRequestException('doctor_not_found');

    const startsAt = new Date(Date.now() + 1_000);
    const endsAt = new Date(startsAt.getTime() + 2 * 60 * 60_000);
    const reason = (body?.reason as string | undefined) ?? 'Instant consultation';

    try {
      const appointment = await this.prisma.appointment.create({
        data: {
          patientId,
          doctorId,
          startsAt,
          endsAt,
          reason,
        },
      });

      await this.notifications.createForUsers([patientId, doctorId], {
        type: NotificationType.APPOINTMENT_BOOKED,
        title: 'Instant consultation started',
        message: 'An instant consultation is ready to join.',
        data: { appointmentId: appointment.id, instant: true },
      });

      return appointment;
    } catch (error) {
      throw bookingConflictError(error);
    }
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Req() req: any, @Body() body: any) {
    const patientId = req.user?.sub as string | undefined;
    const role = req.user?.role as Role | undefined;
    if (!patientId || !role) throw new Error('missing_user');
    if (role !== 'PATIENT') throw new Error('forbidden');

    const doctorId = body.doctorId as string;
    const startsAt = new Date(body.startsAt as string);
    const endsAt = new Date(body.endsAt as string);
    const reason = body.reason as string | undefined;

    if (Number.isNaN(startsAt.getTime()) || Number.isNaN(endsAt.getTime())) {
      throw new BadRequestException('invalid_datetime');
    }
    if (endsAt.getTime() <= startsAt.getTime()) {
      throw new BadRequestException('invalid_time_range');
    }
    if (startsAt.getTime() < Date.now()) {
      throw new BadRequestException('starts_at_in_past');
    }

    try {
      const doctor = await this.prisma.user.findFirst({
        where: { id: doctorId, role: 'DOCTOR' },
        select: { id: true },
      });
      if (!doctor) throw new BadRequestException('doctor_not_found');

      const appointment = await this.prisma.appointment.create({
        data: {
          patientId,
          doctorId,
          startsAt,
          endsAt,
          reason,
        },
      });

      await this.notifications.createForUsers([patientId, doctorId], {
        type: NotificationType.APPOINTMENT_BOOKED,
        title: 'Appointment booked',
        message: 'Your appointment has been booked.',
        data: { appointmentId: appointment.id },
      });

      return appointment;
    } catch (error) {
      throw bookingConflictError(error);
    }
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async cancel(@Req() req: any, @Param('id') id: string) {
    const userId = req.user?.sub as string | undefined;
    if (!userId) throw new Error('missing_user');

    const appointment = await this.prisma.appointment.findUnique({
      where: { id },
    });
    if (!appointment) return { ok: true };

    const can =
      appointment.patientId === userId || appointment.doctorId === userId;
    if (!can) throw new Error('forbidden');

    await this.prisma.appointment.update({
      where: { id },
      data: { status: 'CANCELLED' },
    });

    await this.notifications.createForUsers(
      [appointment.patientId, appointment.doctorId],
      {
        type: NotificationType.APPOINTMENT_CANCELLED,
        title: 'Appointment cancelled',
        message: 'An appointment was cancelled.',
        data: { appointmentId: id },
      },
    );

    return { ok: true };
  }

  @Post(':id/reschedule')
  @UseGuards(JwtAuthGuard)
  async reschedule(
    @Req() req: any,
    @Param('id') id: string,
    @Body() body: any,
  ) {
    const userId = req.user?.sub as string | undefined;
    if (!userId) throw new Error('missing_user');

    const appointment = await this.prisma.appointment.findUnique({
      where: { id },
    });
    if (!appointment) return { ok: true };

    const can =
      appointment.patientId === userId || appointment.doctorId === userId;
    if (!can) throw new Error('forbidden');

    const startsAt = new Date(body.startsAt as string);
    const endsAt = new Date(body.endsAt as string);
    if (Number.isNaN(startsAt.getTime()) || Number.isNaN(endsAt.getTime())) {
      throw new BadRequestException('invalid_datetime');
    }
    if (endsAt.getTime() <= startsAt.getTime()) {
      throw new BadRequestException('invalid_time_range');
    }
    if (startsAt.getTime() < Date.now()) {
      throw new BadRequestException('starts_at_in_past');
    }

    try {
      await this.prisma.appointment.update({
        where: { id },
        data: {
          startsAt,
          endsAt,
        },
      });
    } catch (error) {
      throw bookingConflictError(error);
    }

    await this.notifications.createForUsers(
      [appointment.patientId, appointment.doctorId],
      {
        type: NotificationType.APPOINTMENT_RESCHEDULED,
        title: 'Appointment rescheduled',
        message: 'An appointment was rescheduled.',
        data: { appointmentId: id },
      },
    );

    return { ok: true };
  }

  @Get(':id/soap')
  @UseGuards(JwtAuthGuard)
  async getSoap(@Req() req: any, @Param('id') id: string) {
    const userId = req.user?.sub as string | undefined;
    if (!userId) throw new Error('missing_user');

    const appt = await this.prisma.appointment.findUnique({ where: { id } });
    if (!appt) return null;
    if (appt.patientId !== userId && appt.doctorId !== userId) {
      throw new BadRequestException('forbidden');
    }

    return this.prisma.soapNote.findUnique({ where: { appointmentId: id } });
  }

  @Post(':id/soap')
  @UseGuards(JwtAuthGuard)
  @Roles('DOCTOR')
  async upsertSoap(
    @Req() req: any,
    @Param('id') id: string,
    @Body() body: any,
  ) {
    const doctorId = req.user?.sub as string | undefined;
    if (!doctorId) throw new Error('missing_user');

    const appt = await this.prisma.appointment.findUnique({ where: { id } });
    if (!appt || appt.doctorId !== doctorId) throw new Error('forbidden');

    const rawBody = (body ?? {}) as Record<string, unknown>;
    const diagnosesArray = Array.isArray(rawBody.diagnoses)
      ? (rawBody.diagnoses as unknown[]).filter(
          (entry) => entry && typeof entry === 'object',
        )
      : null;
    const recommendedTestsArray = Array.isArray(rawBody.recommendedTests)
      ? (rawBody.recommendedTests as unknown[]).filter(
          (entry) => entry && typeof entry === 'object',
        )
      : null;

    const data = {
      subjective: (rawBody.subjective as string | null | undefined) ?? null,
      objective: (rawBody.objective as string | null | undefined) ?? null,
      assessment: (rawBody.assessment as string | null | undefined) ?? null,
      plan: (rawBody.plan as string | null | undefined) ?? null,
      diagnoses:
        diagnosesArray === null
          ? Prisma.JsonNull
          : (diagnosesArray as Prisma.InputJsonValue),
      recommendedTests:
        recommendedTestsArray === null
          ? Prisma.JsonNull
          : (recommendedTestsArray as Prisma.InputJsonValue),
    };

    const soap = await this.prisma.soapNote.upsert({
      where: { appointmentId: id },
      create: { appointmentId: id, ...data },
      update: data,
    });

    await this.notifications.createForUsers([appt.patientId], {
      type: NotificationType.GENERAL,
      title: 'SOAP note updated',
      message: 'Your doctor updated your SOAP note.',
      data: { appointmentId: id },
    });

    return soap;
  }

  @Post(':id/review')
  @UseGuards(JwtAuthGuard)
  @Roles('PATIENT')
  async createReview(
    @Req() req: any,
    @Param('id') id: string,
    @Body() body: any,
  ) {
    const patientId = req.user?.sub as string | undefined;
    if (!patientId) throw new Error('missing_user');

    const appt = await this.prisma.appointment.findUnique({ where: { id } });
    if (!appt || appt.patientId !== patientId) throw new Error('forbidden');

    const review = await this.prisma.review.create({
      data: {
        appointmentId: id,
        rating: Number(body.rating ?? 0),
        comment: body.comment ?? null,
      },
    });

    await this.notifications.createForUsers([appt.doctorId], {
      type: NotificationType.GENERAL,
      title: 'New review',
      message: 'A patient left a review.',
      data: { appointmentId: id, reviewId: review.id },
    });

    return review;
  }
}
