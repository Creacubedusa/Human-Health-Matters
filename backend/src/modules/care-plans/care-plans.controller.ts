import { Controller, ForbiddenException, Get, NotFoundException, Param, Req, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PrescriptionStatus, Role } from '@prisma/client';
import { JwtAuthGuard } from '../../common/auth/jwt-auth.guard';
import { PrismaService } from '../../prisma/prisma.service';

interface DiagnosisJson {
  id?: string;
  name?: string;
  icd10Code?: string;
  priority?: string;
}

interface RecommendedTestJson {
  id?: string;
  name?: string;
}

function toDiagnoses(value: unknown): { id: string; name: string; icd10Code: string; priority: 'primary' | 'secondary' }[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((entry, index): { id: string; name: string; icd10Code: string; priority: 'primary' | 'secondary' } | null => {
      if (!entry || typeof entry !== 'object') return null;
      const d = entry as DiagnosisJson;
      const name = typeof d.name === 'string' ? d.name : '';
      if (!name.trim()) return null;
      return {
        id: typeof d.id === 'string' && d.id ? d.id : `diagnosis-${index}`,
        name,
        icd10Code: typeof d.icd10Code === 'string' ? d.icd10Code : '',
        priority: d.priority === 'secondary' ? 'secondary' : 'primary',
      };
    })
    .filter((entry): entry is { id: string; name: string; icd10Code: string; priority: 'primary' | 'secondary' } => Boolean(entry));
}

function toTests(value: unknown): { id: string; name: string }[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((entry, index): { id: string; name: string } | null => {
      if (!entry || typeof entry !== 'object') return null;
      const t = entry as RecommendedTestJson;
      const name = typeof t.name === 'string' ? t.name : '';
      if (!name.trim()) return null;
      return {
        id: typeof t.id === 'string' && t.id ? t.id : `test-${index}`,
        name,
      };
    })
    .filter((entry): entry is { id: string; name: string } => Boolean(entry));
}

function buildDoctorName(doctor: { firstName: string; lastName: string }) {
  return `${doctor.firstName} ${doctor.lastName}`.trim();
}

function buildSpecialty(specialties: string[] | null | undefined) {
  if (!specialties || specialties.length === 0) return 'General Practice';
  return specialties[0];
}

function splitToLines(value: string | null | undefined): string[] {
  if (!value) return [];
  return value
    .split(/\n+|;\s*/)
    .map((line) => line.trim())
    .filter(Boolean);
}

function formatDate(date: Date) {
  return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

function formatShortDate(date: Date) {
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function formatDuration(starts: Date, ends: Date): string {
  const minutes = Math.max(1, Math.round((ends.getTime() - starts.getTime()) / 60000));
  if (minutes < 60) return `${minutes} min`;
  const hrs = Math.floor(minutes / 60);
  const rem = minutes % 60;
  return rem === 0 ? `${hrs} hr` : `${hrs} hr ${rem} min`;
}

@ApiTags('care-plans')
@Controller('care-plans')
export class CarePlansController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async list(@Req() req: any) {
    const userId = req.user?.sub as string | undefined;
    const role = req.user?.role as Role | undefined;
    if (!userId || !role) throw new ForbiddenException('missing_user');

    const where = role === 'DOCTOR' ? { doctorId: userId } : { patientId: userId };

    const appointments = await this.prisma.appointment.findMany({
      where: {
        ...where,
        soapNote: { isNot: null },
      },
      orderBy: { startsAt: 'desc' },
      include: {
        soapNote: true,
        doctor: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            doctorProfile: { select: { specialties: true, avatarUri: true } },
          },
        },
        prescriptions: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    const now = Date.now();
    return appointments.map((appt) => {
      const soap = appt.soapNote!;
      const isInactive = appt.status === 'CANCELLED' || appt.endsAt.getTime() <= now - 30 * 86400000;
      return {
        id: soap.id,
        appointmentId: appt.id,
        status: isInactive ? 'inactive' : 'active',
        consultationTitle: appt.reason ?? 'Consultation',
        doctorId: appt.doctor.id,
        doctorName: `Doctor ${buildDoctorName(appt.doctor)}`,
        doctorDisplayName: buildDoctorName(appt.doctor),
        specialty: buildSpecialty(appt.doctor.doctorProfile?.specialties),
        avatarUri: appt.doctor.doctorProfile?.avatarUri ?? '',
        consultationDate: formatDate(appt.startsAt),
        detailDate: formatShortDate(appt.startsAt),
        duration: formatDuration(appt.startsAt, appt.endsAt),
        sessionType: 'Video',
        consultationType: 'Virtual',
        soapNotes: {
          subjective: soap.subjective ?? '',
          objective: soap.objective ?? '',
          assessment: splitToLines(soap.assessment),
          plan: splitToLines(soap.plan),
        },
        diagnoses: toDiagnoses(soap.diagnoses),
        recommendedTests: toTests(soap.recommendedTests),
        prescriptions: appt.prescriptions
          .filter((rx) => rx.status === PrescriptionStatus.ACTIVE)
          .map((rx) => ({
            id: rx.id,
            medication: rx.medication,
            details: [
              `Dose: ${rx.dose}`,
              `Frequency: ${rx.frequency}`,
              `Duration: ${rx.duration}`,
              `Route: ${rx.route}`,
            ].filter(Boolean),
          })),
      };
    });
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async detail(@Req() req: any, @Param('id') id: string) {
    const userId = req.user?.sub as string | undefined;
    if (!userId) throw new ForbiddenException('missing_user');

    const soap = await this.prisma.soapNote.findUnique({
      where: { id },
      include: {
        appointment: {
          include: {
            doctor: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                doctorProfile: { select: { specialties: true, avatarUri: true } },
              },
            },
            prescriptions: { orderBy: { createdAt: 'desc' } },
          },
        },
      },
    });
    if (!soap) throw new NotFoundException('care_plan_not_found');

    const appt = soap.appointment;
    if (appt.patientId !== userId && appt.doctorId !== userId) {
      throw new ForbiddenException('forbidden');
    }

    return {
      id: soap.id,
      appointmentId: appt.id,
      status: appt.status === 'CANCELLED' ? 'inactive' : 'active',
      consultationTitle: appt.reason ?? 'Consultation',
      doctorId: appt.doctor.id,
      doctorName: `Doctor ${buildDoctorName(appt.doctor)}`,
      doctorDisplayName: buildDoctorName(appt.doctor),
      specialty: buildSpecialty(appt.doctor.doctorProfile?.specialties),
      avatarUri: appt.doctor.doctorProfile?.avatarUri ?? '',
      consultationDate: formatDate(appt.startsAt),
      detailDate: formatShortDate(appt.startsAt),
      duration: formatDuration(appt.startsAt, appt.endsAt),
      sessionType: 'Video',
      consultationType: 'Virtual',
      soapNotes: {
        subjective: soap.subjective ?? '',
        objective: soap.objective ?? '',
        assessment: splitToLines(soap.assessment),
        plan: splitToLines(soap.plan),
      },
      diagnoses: toDiagnoses(soap.diagnoses),
      recommendedTests: toTests(soap.recommendedTests),
      prescriptions: appt.prescriptions
        .filter((rx) => rx.status === PrescriptionStatus.ACTIVE)
        .map((rx) => ({
          id: rx.id,
          medication: rx.medication,
          details: [
            `Dose: ${rx.dose}`,
            `Frequency: ${rx.frequency}`,
            `Duration: ${rx.duration}`,
            `Route: ${rx.route}`,
          ],
        })),
    };
  }
}
