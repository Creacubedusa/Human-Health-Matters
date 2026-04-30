import { Body, Controller, Get, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ProfileSetupDto } from './dto/profile-setup.dto';
import { ProfileOverviewUpdateDto } from './dto/profile-overview-update.dto';
import { JwtAuthGuard } from '../../common/auth/jwt-auth.guard';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma } from '@prisma/client';

function parseDob(dob: string): Date | null {
  const text = dob.trim();
  if (!text) return null;

  const m1 = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(text);
  if (m1) {
    const dd = Number(m1[1]);
    const mm = Number(m1[2]);
    const yyyy = Number(m1[3]);
    const d = new Date(Date.UTC(yyyy, mm - 1, dd));
    if (Number.isFinite(d.getTime()) && d.getUTCFullYear() === yyyy && d.getUTCMonth() === mm - 1 && d.getUTCDate() === dd) {
      return d;
    }
  }

  const m3 = /^(\d{2})(\d{2})(\d{4})$/.exec(text);
  if (m3) {
    const dd = Number(m3[1]);
    const mm = Number(m3[2]);
    const yyyy = Number(m3[3]);
    const d = new Date(Date.UTC(yyyy, mm - 1, dd));
    if (Number.isFinite(d.getTime()) && d.getUTCFullYear() === yyyy && d.getUTCMonth() === mm - 1 && d.getUTCDate() === dd) {
      return d;
    }
  }

  const m2 = /^(\d{4})-(\d{2})-(\d{2})$/.exec(text);
  if (m2) {
    const yyyy = Number(m2[1]);
    const mm = Number(m2[2]);
    const dd = Number(m2[3]);
    const d = new Date(Date.UTC(yyyy, mm - 1, dd));
    if (Number.isFinite(d.getTime()) && d.getUTCFullYear() === yyyy && d.getUTCMonth() === mm - 1 && d.getUTCDate() === dd) {
      return d;
    }
  }

  return null;
}

function ageYearsFromDob(dob: Date, now = new Date()): number {
  const nowUtc = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  let age = nowUtc.getUTCFullYear() - dob.getUTCFullYear();
  const beforeBirthday =
    nowUtc.getUTCMonth() < dob.getUTCMonth() ||
    (nowUtc.getUTCMonth() === dob.getUTCMonth() && nowUtc.getUTCDate() < dob.getUTCDate());
  if (beforeBirthday) age -= 1;
  return age;
}

function computeAgeLabel(dateOfBirth: unknown): string | null {
  if (typeof dateOfBirth !== 'string') return null;
  const dob = parseDob(dateOfBirth);
  if (!dob) return null;
  const years = ageYearsFromDob(dob);
  if (!Number.isFinite(years) || years < 0 || years > 130) return null;
  return `${years} years`;
}

@ApiTags('patients')
@Controller('patients')
export class PatientsController {
  constructor(private readonly prisma: PrismaService) {}

  @Post('profile/setup')
  @UseGuards(JwtAuthGuard)
  async setupProfile(@Req() req: any, @Body() body: ProfileSetupDto) {
    const userId = req.user?.sub as string | undefined;
    const payload = body.payload as Prisma.InputJsonValue;
    if (!userId) throw new Error('missing_user');
    await this.prisma.patientProfile.update({
      where: { userId },
      data: { profileData: payload, onboardingCompletedAt: new Date() },
    });
    return { ok: true };
  }

  @Get('dashboard')
  @UseGuards(JwtAuthGuard)
  async dashboard(@Req() req: any) {
    const userId = req.user?.sub as string | undefined;
    if (!userId) throw new Error('missing_user');

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        firstName: true,
        patientProfile: { select: { onboardingCompletedAt: true, profileData: true } },
      },
    });
    if (!user) throw new Error('missing_user');

    const isNewUser = !user.patientProfile?.onboardingCompletedAt;
    const pd = user.patientProfile?.profileData as any;
    const avatarUri =
      pd && typeof pd === 'object'
        ? (typeof pd.profileOverview?.avatarUri === 'string' ? pd.profileOverview.avatarUri : typeof pd.avatarUri === 'string' ? pd.avatarUri : null)
        : null;

    return {
      patientName: user.firstName,
      avatarUri,
      isNewUser,
      careInProgress: null,
      recentActivities: [],
      careFunding: null,
    };
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async profile(@Req() req: any) {
    const userId = req.user?.sub as string | undefined;
    if (!userId) throw new Error('missing_user');

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        phoneCountryCode: true,
        patientProfile: { select: { profileData: true, onboardingCompletedAt: true } },
      },
    });

    if (!user) throw new Error('missing_user');

    const baseProfile = user.patientProfile?.profileData ?? null;
    const ageLabel =
      baseProfile && typeof baseProfile === 'object' ? computeAgeLabel((baseProfile as any).dateOfBirth) : null;

    let profileOut: Prisma.InputJsonValue | null = baseProfile;
    if (ageLabel && baseProfile && typeof baseProfile === 'object') {
      const obj = baseProfile as Record<string, unknown>;
      const ov = obj.profileOverview && typeof obj.profileOverview === 'object' ? (obj.profileOverview as Record<string, unknown>) : {};
      profileOut = {
        ...obj,
        profileOverview: {
          ...ov,
          age: ageLabel,
        },
      } as Prisma.InputJsonValue;
    }

    return {
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        phoneCountryCode: user.phoneCountryCode,
      },
      profile: profileOut,
      onboardingCompletedAt: user.patientProfile?.onboardingCompletedAt ?? null,
    };
  }

  @Patch('profile/overview')
  @UseGuards(JwtAuthGuard)
  async updateProfileOverview(@Req() req: any, @Body() body: ProfileOverviewUpdateDto) {
    const userId = req.user?.sub as string | undefined;
    if (!userId) throw new Error('missing_user');

    const current = await this.prisma.patientProfile.findUnique({
      where: { userId },
      select: { profileData: true },
    });

    const currentProfile =
      typeof current?.profileData === 'object' && current?.profileData ? (current.profileData as any) : {};
    const ageLabel = computeAgeLabel(currentProfile.dateOfBirth);
    const nextOverview = {
      ...body,
      age: ageLabel ?? body.age,
    };

    const nextProfileData = {
      ...currentProfile,
      profileOverview: nextOverview,
      avatarUri: nextOverview.avatarUri ?? currentProfile.avatarUri,
    } satisfies Prisma.InputJsonObject;

    const [firstName, ...rest] = body.name.trim().split(/\s+/).filter(Boolean);
    const lastName = rest.join(' ');

    await this.prisma.$transaction([
      this.prisma.user.update({
        where: { id: userId },
        data: {
          firstName: firstName || undefined,
          lastName: lastName || undefined,
          email: body.email || undefined,
        },
      }),
      this.prisma.patientProfile.update({
        where: { userId },
        data: {
          profileData: nextProfileData as Prisma.InputJsonValue,
        },
      }),
    ]);

    return { ok: true };
  }
}
