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
import {
  hasDoctorReachedDailyLimit,
  hasDoctorTimeConflict,
  isDoctorAvailableForRange,
  parseDoctorAvailabilitySettings,
} from '../doctors/schedule';

type DoctorBookingReader = Pick<PrismaService, 'user'>;

async function getDoctorBookingContext(prisma: DoctorBookingReader, doctorId: string) {
  const doctor = await prisma.user.findFirst({
    where: { id: doctorId, role: 'DOCTOR' },
    select: {
      doctorProfile: {
        select: {
          availabilitySettings: true,
        },
      },
      appointmentsAsDoctor: {
        where: { status: 'UPCOMING' },
        select: {
          id: true,
          startsAt: true,
          endsAt: true,
          status: true,
        },
      },
    },
  });

  return {
    settings: parseDoctorAvailabilitySettings(
      doctor?.doctorProfile?.availabilitySettings,
    ),
    appointments: doctor?.appointmentsAsDoctor ?? [],
  };
}

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
        patient: { select: { id: true, firstName: true, lastName: true } },
      },
    });

    return items;
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
      const appointment = await this.prisma.$transaction(async (tx) => {
        const doctorContext = await getDoctorBookingContext(tx, doctorId);
        if (!doctorContext.settings) {
          throw new BadRequestException(
            'This doctor has not set availability yet.',
          );
        }
        if (!isDoctorAvailableForRange(doctorContext.settings, startsAt, endsAt)) {
          throw new BadRequestException(
            'This doctor is not available at the selected time.',
          );
        }
        const bufferMinutes = doctorContext.settings.bookingLimits.bufferEnabled
          ? doctorContext.settings.bookingLimits.bufferDurationMinutes
          : 0;
        if (
          hasDoctorTimeConflict(
            doctorContext.appointments,
            startsAt,
            endsAt,
            bufferMinutes,
          )
        ) {
          throw new BadRequestException(
            'This time slot has already been booked.',
          );
        }
        if (
          hasDoctorReachedDailyLimit(
            doctorContext.settings,
            doctorContext.appointments,
            startsAt,
          )
        ) {
          throw new BadRequestException(
            'This doctor has reached the booking limit for that day.',
          );
        }

        return tx.appointment.create({
          data: {
            patientId,
            doctorId,
            startsAt,
            endsAt,
            reason,
          },
        });
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
      await this.prisma.$transaction(async (tx) => {
        const doctorContext = await getDoctorBookingContext(
          tx,
          appointment.doctorId,
        );
        if (!doctorContext.settings) {
          throw new BadRequestException(
            'This doctor has not set availability yet.',
          );
        }
        if (!isDoctorAvailableForRange(doctorContext.settings, startsAt, endsAt)) {
          throw new BadRequestException(
            'This doctor is not available at the selected time.',
          );
        }
        const bufferMinutes = doctorContext.settings.bookingLimits.bufferEnabled
          ? doctorContext.settings.bookingLimits.bufferDurationMinutes
          : 0;
        if (
          hasDoctorTimeConflict(
            doctorContext.appointments.filter((item) => item.id !== appointment.id),
            startsAt,
            endsAt,
            bufferMinutes,
          )
        ) {
          throw new BadRequestException(
            'This time slot has already been booked.',
          );
        }
        if (
          hasDoctorReachedDailyLimit(
            doctorContext.settings,
            doctorContext.appointments.filter((item) => item.id !== appointment.id),
            startsAt,
          )
        ) {
          throw new BadRequestException(
            'This doctor has reached the booking limit for that day.',
          );
        }

        await tx.appointment.update({
          where: { id },
          data: {
            startsAt,
            endsAt,
          },
        });
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

    const soap = await this.prisma.soapNote.upsert({
      where: { appointmentId: id },
      create: {
        appointmentId: id,
        subjective: body.subjective ?? null,
        objective: body.objective ?? null,
        assessment: body.assessment ?? null,
        plan: body.plan ?? null,
      },
      update: {
        subjective: body.subjective ?? null,
        objective: body.objective ?? null,
        assessment: body.assessment ?? null,
        plan: body.plan ?? null,
      },
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
