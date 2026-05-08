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
import { LabOrderStatus, NotificationType, Prisma, Role } from '@prisma/client';
import { JwtAuthGuard } from '../../common/auth/jwt-auth.guard';
import { Roles } from '../../common/auth/roles.decorator';
import { PrismaService } from '../../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';

interface CreateLabOrderBody {
  patientId?: string;
  appointmentId?: string;
  testName?: string;
  testType?: string;
  priority?: string;
  sampleType?: string;
  collectionInstruction?: string;
  additionalComment?: string;
}

interface SubmittedFile {
  name: string;
  url: string;
  mimeType?: string | null;
  sizeBytes?: number | null;
}

interface SubmitLabOrderBody {
  files?: SubmittedFile[];
}

function buildDoctorName(doctor: { firstName: string; lastName: string } | null) {
  if (!doctor) return 'Doctor';
  return `${doctor.firstName} ${doctor.lastName}`.trim();
}

function buildSpecialty(specialties: string[] | null | undefined) {
  if (!specialties || specialties.length === 0) return 'General Practice';
  return specialties[0];
}

function mapStatus(status: LabOrderStatus): 'ongoing' | 'completed' {
  return status === LabOrderStatus.PENDING ? 'ongoing' : 'completed';
}

function sanitizeFiles(value: unknown): SubmittedFile[] {
  if (!Array.isArray(value)) return [];
  const result: SubmittedFile[] = [];
  for (const entry of value) {
    if (!entry || typeof entry !== 'object') continue;
    const url = (entry as { url?: unknown }).url;
    if (typeof url !== 'string' || url.length === 0) continue;
    const name = (entry as { name?: unknown }).name;
    const mimeType = (entry as { mimeType?: unknown }).mimeType;
    const sizeBytes = (entry as { sizeBytes?: unknown }).sizeBytes;
    result.push({
      name: typeof name === 'string' && name.length > 0 ? name : 'attachment',
      url,
      mimeType: typeof mimeType === 'string' ? mimeType : null,
      sizeBytes:
        typeof sizeBytes === 'number' && Number.isFinite(sizeBytes) ? sizeBytes : null,
    });
  }
  return result;
}

@ApiTags('lab-orders')
@Controller('lab-orders')
export class LabOrdersController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notifications: NotificationsService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @Roles('DOCTOR')
  async create(@Req() req: any, @Body() body: CreateLabOrderBody) {
    const doctorId = req.user?.sub as string | undefined;
    if (!doctorId) throw new ForbiddenException('missing_user');

    const testName = (body.testName ?? '').trim();
    if (!testName) throw new BadRequestException('test_name_required');

    let patientId = body.patientId;
    const appointmentId = body.appointmentId;

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

    const order = await this.prisma.labOrder.create({
      data: {
        patientId: patient.id,
        doctorId,
        appointmentId: appointmentId ?? null,
        testName,
        testType: body.testType?.trim() || null,
        priority: body.priority?.trim() || null,
        sampleType: body.sampleType?.trim() || null,
        collectionInstruction: body.collectionInstruction?.trim() || null,
        additionalComment: body.additionalComment?.trim() || null,
        status: LabOrderStatus.PENDING,
      },
    });

    await this.notifications.createForUsers([patient.id], {
      type: NotificationType.LAB_ORDER_CREATED,
      title: 'New lab order',
      message: `Your doctor requested a ${testName}.`,
      data: { labOrderId: order.id, appointmentId: appointmentId ?? null },
    });

    return order;
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async list(@Req() req: any) {
    const userId = req.user?.sub as string | undefined;
    const role = req.user?.role as Role | undefined;
    if (!userId || !role) throw new ForbiddenException('missing_user');

    const where = role === 'DOCTOR' ? { doctorId: userId } : { patientId: userId };

    const items = await this.prisma.labOrder.findMany({
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

    return items.map((o) => ({
      id: o.id,
      patientId: o.patientId,
      doctorId: o.doctorId,
      appointmentId: o.appointmentId,
      testName: o.testName,
      testType: o.testType,
      priority: o.priority,
      sampleType: o.sampleType,
      collectionInstruction: o.collectionInstruction,
      additionalComment: o.additionalComment,
      status: mapStatus(o.status),
      rawStatus: o.status,
      submittedFiles: sanitizeFiles(o.submittedFiles),
      submittedAt: o.submittedAt?.toISOString() ?? null,
      doctorName: buildDoctorName(o.doctor),
      doctorAvatarUri: o.doctor?.doctorProfile?.avatarUri ?? null,
      specialty: buildSpecialty(o.doctor?.doctorProfile?.specialties),
      patientName: o.patient ? `${o.patient.firstName} ${o.patient.lastName}`.trim() : '',
      createdAt: o.createdAt.toISOString(),
      updatedAt: o.updatedAt.toISOString(),
    }));
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async detail(@Req() req: any, @Param('id') id: string) {
    const userId = req.user?.sub as string | undefined;
    if (!userId) throw new ForbiddenException('missing_user');

    const item = await this.prisma.labOrder.findUnique({
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
    if (!item) throw new NotFoundException('lab_order_not_found');

    if (item.patientId !== userId && item.doctorId !== userId) {
      throw new ForbiddenException('forbidden');
    }

    return {
      id: item.id,
      patientId: item.patientId,
      doctorId: item.doctorId,
      appointmentId: item.appointmentId,
      testName: item.testName,
      testType: item.testType,
      priority: item.priority,
      sampleType: item.sampleType,
      collectionInstruction: item.collectionInstruction,
      additionalComment: item.additionalComment,
      status: mapStatus(item.status),
      rawStatus: item.status,
      submittedFiles: sanitizeFiles(item.submittedFiles),
      submittedAt: item.submittedAt?.toISOString() ?? null,
      doctorName: buildDoctorName(item.doctor),
      doctorAvatarUri: item.doctor?.doctorProfile?.avatarUri ?? null,
      specialty: buildSpecialty(item.doctor?.doctorProfile?.specialties),
      patientName: item.patient ? `${item.patient.firstName} ${item.patient.lastName}`.trim() : '',
      createdAt: item.createdAt.toISOString(),
      updatedAt: item.updatedAt.toISOString(),
    };
  }

  @Post(':id/submit')
  @UseGuards(JwtAuthGuard)
  @Roles('PATIENT')
  async submit(@Req() req: any, @Param('id') id: string, @Body() body: SubmitLabOrderBody) {
    const patientId = req.user?.sub as string | undefined;
    if (!patientId) throw new ForbiddenException('missing_user');

    const item = await this.prisma.labOrder.findUnique({ where: { id } });
    if (!item) throw new NotFoundException('lab_order_not_found');
    if (item.patientId !== patientId) throw new ForbiddenException('forbidden');

    const incoming = sanitizeFiles(body?.files);
    if (incoming.length === 0) throw new BadRequestException('files_required');

    const existing = sanitizeFiles(item.submittedFiles);
    const merged = [...existing, ...incoming];

    const updated = await this.prisma.labOrder.update({
      where: { id },
      data: {
        submittedFiles: merged as unknown as Prisma.InputJsonValue,
        submittedAt: new Date(),
        status: LabOrderStatus.SUBMITTED,
      },
    });

    await this.notifications.createForUsers([item.doctorId], {
      type: NotificationType.LAB_ORDER_SUBMITTED,
      title: 'Lab results submitted',
      message: `A patient submitted results for ${item.testName}.`,
      data: { labOrderId: item.id, appointmentId: item.appointmentId ?? null },
    });

    return {
      id: updated.id,
      status: mapStatus(updated.status),
      rawStatus: updated.status,
      submittedFiles: sanitizeFiles(updated.submittedFiles),
      submittedAt: updated.submittedAt?.toISOString() ?? null,
    };
  }
}
