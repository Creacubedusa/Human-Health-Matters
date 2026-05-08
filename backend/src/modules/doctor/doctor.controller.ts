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

function parseDob(dob: string): Date | null {
  const text = dob.trim();
  if (!text) return null;
  const tryDate = (yyyy: number, mm: number, dd: number) => {
    const d = new Date(Date.UTC(yyyy, mm - 1, dd));
    if (
      Number.isFinite(d.getTime()) &&
      d.getUTCFullYear() === yyyy &&
      d.getUTCMonth() === mm - 1 &&
      d.getUTCDate() === dd
    ) {
      return d;
    }
    return null;
  };

  const m1 = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(text);
  if (m1) return tryDate(Number(m1[3]), Number(m1[2]), Number(m1[1]));
  const m3 = /^(\d{2})(\d{2})(\d{4})$/.exec(text);
  if (m3) return tryDate(Number(m3[3]), Number(m3[2]), Number(m3[1]));
  const m2 = /^(\d{4})-(\d{2})-(\d{2})$/.exec(text);
  if (m2) return tryDate(Number(m2[1]), Number(m2[2]), Number(m2[3]));
  return null;
}

function computeAgeYears(dateOfBirth: unknown): number | null {
  if (typeof dateOfBirth !== 'string') return null;
  const dob = parseDob(dateOfBirth);
  if (!dob) return null;
  const now = new Date();
  const nowUtc = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  let age = nowUtc.getUTCFullYear() - dob.getUTCFullYear();
  const beforeBirthday =
    nowUtc.getUTCMonth() < dob.getUTCMonth() ||
    (nowUtc.getUTCMonth() === dob.getUTCMonth() && nowUtc.getUTCDate() < dob.getUTCDate());
  if (beforeBirthday) age -= 1;
  if (!Number.isFinite(age) || age < 0 || age > 130) return null;
  return age;
}

type PatientProfileSnapshot = {
  age: number | null;
  gender: string | null;
  height: string | null;
  weight: string | null;
  address: string | null;
  nationality: string | null;
  phone: string | null;
  email: string | null;
  avatarUri: string | null;
};

function readString(value: unknown): string | null {
  return typeof value === 'string' && value.trim() ? value : null;
}

function buildPatientProfileSnapshot(
  profileData: unknown,
): PatientProfileSnapshot {
  const obj =
    profileData && typeof profileData === 'object'
      ? (profileData as Record<string, unknown>)
      : {};
  const overview =
    obj.profileOverview && typeof obj.profileOverview === 'object'
      ? (obj.profileOverview as Record<string, unknown>)
      : {};
  const ageFromDob = computeAgeYears(obj.dateOfBirth);
  const ageFromOverview = (() => {
    const raw = overview.age;
    if (typeof raw === 'number' && Number.isFinite(raw)) return raw;
    if (typeof raw === 'string') {
      const m = raw.match(/(\d{1,3})/);
      if (m) return Number(m[1]);
    }
    return null;
  })();
  return {
    age: ageFromDob ?? ageFromOverview,
    gender:
      readString(obj.gender) ?? readString(overview.gender) ?? null,
    height: readString(overview.height),
    weight: readString(overview.weight),
    address: readString(obj.address) ?? readString(overview.address),
    nationality:
      readString(obj.nationality) ?? readString(overview.nationality),
    phone: readString(overview.phone),
    email: readString(overview.email),
    avatarUri:
      readString(overview.avatarUri) ??
      readString((obj as { avatarUri?: unknown }).avatarUri),
  };
}

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
        age: number | null;
        gender: string | null;
      }
    >();
    for (const a of appts) {
      if (map.has(a.patient.id)) continue;
      const snapshot = buildPatientProfileSnapshot(
        a.patient.patientProfile?.profileData,
      );
      map.set(a.patient.id, {
        id: a.patient.id,
        name: [a.patient.firstName, a.patient.lastName]
          .filter(Boolean)
          .join(' '),
        lastVisit: a.startsAt.toISOString(),
        avatarUri: snapshot.avatarUri,
        age: snapshot.age,
        gender: snapshot.gender,
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
      select: { id: true, startsAt: true },
      orderBy: { startsAt: 'desc' },
    });
    if (!has) throw new Error('forbidden');

    const patient = await this.prisma.user.findUnique({
      where: { id: patientId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        phoneCountryCode: true,
        patientProfile: { select: { profileData: true } },
      },
    });

    if (!patient) throw new Error('patient_not_found');

    const snapshot = buildPatientProfileSnapshot(
      patient.patientProfile?.profileData,
    );

    const fullName = [patient.firstName, patient.lastName]
      .filter(Boolean)
      .join(' ');
    const phoneFromUser = patient.phone
      ? `${patient.phoneCountryCode ?? ''}${patient.phone}`.trim()
      : null;

    return {
      id: patient.id,
      firstName: patient.firstName,
      lastName: patient.lastName,
      name: fullName,
      email: patient.email ?? snapshot.email ?? '',
      phone: phoneFromUser ?? snapshot.phone ?? '',
      avatarUri: snapshot.avatarUri,
      age: snapshot.age,
      gender: snapshot.gender,
      height: snapshot.height,
      weight: snapshot.weight,
      address: snapshot.address ?? '',
      nationality: snapshot.nationality ?? '',
      lastVisit: has.startsAt.toISOString(),
      profile: patient.patientProfile?.profileData ?? null,
    };
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
