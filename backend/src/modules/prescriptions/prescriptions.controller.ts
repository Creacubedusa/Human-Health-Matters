import {
  BadRequestException,
  Body,
  Controller,
  ForbiddenException,
  Get,
  NotFoundException,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { NotificationType, PrescriptionStatus, Role } from '@prisma/client';
import { JwtAuthGuard } from '../../common/auth/jwt-auth.guard';
import { Roles } from '../../common/auth/roles.decorator';
import { PrismaService } from '../../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';

interface PrescriptionDraftBody {
  medication?: string;
  brandName?: string;
  dose?: string;
  frequency?: string;
  duration?: string;
  route?: string;
  refillsLeft?: string | number;
  notes?: string;
}

interface CreatePrescriptionsBody {
  patientId?: string;
  appointmentId?: string;
  prescriptions?: PrescriptionDraftBody[];
}

function generateRxNumber() {
  const year = new Date().getFullYear();
  const random = Math.floor(1000 + Math.random() * 9000);
  return `RX-${year}-${random}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
}

function toInt(value: unknown): number {
  if (typeof value === 'number' && Number.isFinite(value)) return Math.max(0, Math.floor(value));
  if (typeof value === 'string') {
    const m = value.match(/(\d+)/);
    if (m) return Math.max(0, Number(m[1]));
  }
  return 0;
}

function buildDoctorName(doctor: { firstName: string; lastName: string } | null) {
  if (!doctor) return 'Doctor';
  return `${doctor.firstName} ${doctor.lastName}`.trim();
}

function buildSpecialty(specialties: string[] | null | undefined) {
  if (!specialties || specialties.length === 0) return 'General Practice';
  return specialties[0];
}

@ApiTags('prescriptions')
@Controller('prescriptions')
export class PrescriptionsController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notifications: NotificationsService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @Roles('DOCTOR')
  async create(@Req() req: any, @Body() body: CreatePrescriptionsBody) {
    const doctorId = req.user?.sub as string | undefined;
    if (!doctorId) throw new ForbiddenException('missing_user');

    const drafts = Array.isArray(body?.prescriptions) ? body.prescriptions : [];
    if (drafts.length === 0) throw new BadRequestException('prescriptions_required');

    let patientId = body?.patientId;
    const appointmentId = body?.appointmentId;

    if (appointmentId) {
      const appt = await this.prisma.appointment.findUnique({ where: { id: appointmentId } });
      if (!appt || appt.doctorId !== doctorId) throw new ForbiddenException('forbidden');
      patientId = appt.patientId;
    }

    if (!patientId) throw new BadRequestException('patient_required');

    const patient = await this.prisma.user.findFirst({
      where: { id: patientId, role: 'PATIENT' },
      select: { id: true },
    });
    if (!patient) throw new BadRequestException('patient_not_found');

    const created = await this.prisma.$transaction(
      drafts.map((draft) => {
        const refills = toInt(draft.refillsLeft);
        return this.prisma.prescription.create({
          data: {
            patientId: patient.id,
            doctorId,
            appointmentId: appointmentId ?? null,
            medication: (draft.medication ?? '').trim(),
            brandName: draft.brandName?.trim() || null,
            dose: (draft.dose ?? '').trim(),
            frequency: (draft.frequency ?? '').trim(),
            duration: (draft.duration ?? '').trim(),
            route: (draft.route ?? '').trim(),
            refillsLeft: refills,
            totalRefills: refills,
            notes: draft.notes?.trim() || null,
            status: PrescriptionStatus.ACTIVE,
            rxNumber: generateRxNumber(),
          },
        });
      }),
    );

    await this.notifications.createForUsers([patient.id], {
      type: NotificationType.PRESCRIPTION_CREATED,
      title: 'New prescription',
      message:
        created.length === 1
          ? `${created[0].medication || 'A medication'} has been prescribed.`
          : `${created.length} medications have been prescribed.`,
      data: {
        appointmentId: appointmentId ?? null,
        prescriptionIds: created.map((p) => p.id),
      },
    });

    return created;
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async list(@Req() req: any) {
    const userId = req.user?.sub as string | undefined;
    const role = req.user?.role as Role | undefined;
    if (!userId || !role) throw new ForbiddenException('missing_user');

    const where = role === 'DOCTOR' ? { doctorId: userId } : { patientId: userId };

    const items = await this.prisma.prescription.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        doctor: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            doctorProfile: { select: { specialties: true, avatarUri: true } },
          },
        },
        patient: {
          select: { id: true, firstName: true, lastName: true },
        },
      },
    });

    return items.map((p) => ({
      id: p.id,
      patientId: p.patientId,
      doctorId: p.doctorId,
      appointmentId: p.appointmentId,
      doctorName: buildDoctorName(p.doctor),
      doctorAvatarUri: p.doctor?.doctorProfile?.avatarUri ?? null,
      specialty: buildSpecialty(p.doctor?.doctorProfile?.specialties),
      patientName: p.patient ? `${p.patient.firstName} ${p.patient.lastName}`.trim() : '',
      medication: p.medication,
      brandName: p.brandName,
      dose: p.dose,
      frequency: p.frequency,
      duration: p.duration,
      route: p.route,
      refillsLeft: p.refillsLeft,
      totalRefills: p.totalRefills,
      notes: p.notes,
      status: p.status === PrescriptionStatus.ACTIVE ? 'active' : 'inactive',
      rxNumber: p.rxNumber,
      createdAt: p.createdAt.toISOString(),
      updatedAt: p.updatedAt.toISOString(),
    }));
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async detail(@Req() req: any, @Param('id') id: string) {
    const userId = req.user?.sub as string | undefined;
    if (!userId) throw new ForbiddenException('missing_user');

    const item = await this.prisma.prescription.findUnique({
      where: { id },
      include: {
        doctor: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            doctorProfile: { select: { specialties: true, avatarUri: true } },
          },
        },
        patient: {
          select: { id: true, firstName: true, lastName: true },
        },
      },
    });
    if (!item) throw new NotFoundException('prescription_not_found');

    if (item.patientId !== userId && item.doctorId !== userId) {
      throw new ForbiddenException('forbidden');
    }

    return {
      id: item.id,
      patientId: item.patientId,
      doctorId: item.doctorId,
      appointmentId: item.appointmentId,
      doctorName: buildDoctorName(item.doctor),
      doctorAvatarUri: item.doctor?.doctorProfile?.avatarUri ?? null,
      specialty: buildSpecialty(item.doctor?.doctorProfile?.specialties),
      patientName: item.patient ? `${item.patient.firstName} ${item.patient.lastName}`.trim() : '',
      medication: item.medication,
      brandName: item.brandName,
      dose: item.dose,
      frequency: item.frequency,
      duration: item.duration,
      route: item.route,
      refillsLeft: item.refillsLeft,
      totalRefills: item.totalRefills,
      notes: item.notes,
      status: item.status === PrescriptionStatus.ACTIVE ? 'active' : 'inactive',
      rxNumber: item.rxNumber,
      createdAt: item.createdAt.toISOString(),
      updatedAt: item.updatedAt.toISOString(),
    };
  }
}
