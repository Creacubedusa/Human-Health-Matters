import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service';
import bcrypt from 'bcryptjs';
import { MailerService } from '../mailer/mailer.service';
import { Role } from '@prisma/client';

function randomOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function addMinutes(date: Date, minutes: number) {
  return new Date(date.getTime() + minutes * 60 * 1000);
}

function normalizePhone(phone: string) {
  return phone.replace(/\D/g, '');
}

function normalizeCountryCode(code: string) {
  const trimmed = code.trim();
  if (!trimmed) return '';
  return trimmed.startsWith('+') ? trimmed : `+${trimmed}`;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly mailer: MailerService,
  ) {}

  async registerPatient(input: {
    firstName: string;
    lastName: string;
    email?: string;
    phone?: string;
    phoneCountryCode?: string;
    password: string;
  }) {
    if (!input.email && !input.phone) {
      throw new BadRequestException('email_or_phone_required');
    }

    if (input.email) {
      const exists = await this.prisma.user.findUnique({
        where: { email: input.email },
      });
      if (exists) throw new BadRequestException('email_taken');
    }

    if (input.phone) {
      if (!input.phoneCountryCode)
        throw new BadRequestException('phone_country_code_required');
      const phone = normalizePhone(input.phone);
      const phoneCountryCode = normalizeCountryCode(input.phoneCountryCode);
      if (!phone) throw new BadRequestException('phone_invalid');

      const exists = await this.prisma.user.findFirst({
        where: {
          phone,
          phoneCountryCode,
        },
        select: { id: true },
      });
      if (exists) throw new BadRequestException('phone_taken');
    }

    const passwordHash = await bcrypt.hash(input.password, 12);
    const phone = input.phone ? normalizePhone(input.phone) : undefined;
    const phoneCountryCode = input.phoneCountryCode
      ? normalizeCountryCode(input.phoneCountryCode)
      : undefined;
    const user = await this.prisma.user.create({
      data: {
        firstName: input.firstName,
        lastName: input.lastName,
        email: input.email,
        phoneCountryCode: phone ? (phoneCountryCode ?? null) : null,
        phone,
        passwordHash,
        role: Role.PATIENT,
        patientProfile: { create: {} },
      },
      select: { id: true, email: true, role: true },
    });

    if (user.email) {
      try {
        await this.sendEmailOtp(user.email, 'verify', user.id);
      } catch (e) {
        console.error('email_otp_send_failed', e);
      }
    }

    return { userId: user.id, role: user.role };
  }

  async registerDoctor(input: {
    firstName: string;
    lastName: string;
    email?: string;
    phone?: string;
    phoneCountryCode?: string;
    password: string;
  }) {
    if (!input.email && !input.phone) {
      throw new BadRequestException('email_or_phone_required');
    }

    if (input.email) {
      const exists = await this.prisma.user.findUnique({
        where: { email: input.email },
      });
      if (exists) throw new BadRequestException('email_taken');
    }

    if (input.phone) {
      if (!input.phoneCountryCode)
        throw new BadRequestException('phone_country_code_required');
      const phone = normalizePhone(input.phone);
      const phoneCountryCode = normalizeCountryCode(input.phoneCountryCode);
      if (!phone) throw new BadRequestException('phone_invalid');

      const exists = await this.prisma.user.findFirst({
        where: {
          phone,
          phoneCountryCode,
        },
        select: { id: true },
      });
      if (exists) throw new BadRequestException('phone_taken');
    }

    const passwordHash = await bcrypt.hash(input.password, 12);
    const phone = input.phone ? normalizePhone(input.phone) : undefined;
    const phoneCountryCode = input.phoneCountryCode
      ? normalizeCountryCode(input.phoneCountryCode)
      : undefined;
    const user = await this.prisma.user.create({
      data: {
        firstName: input.firstName,
        lastName: input.lastName,
        email: input.email,
        phoneCountryCode: phone ? (phoneCountryCode ?? null) : null,
        phone,
        passwordHash,
        role: Role.DOCTOR,
        doctorProfile: { create: {} },
      },
      select: { id: true, email: true, role: true },
    });

    if (user.email) {
      try {
        await this.sendEmailOtp(user.email, 'verify', user.id);
      } catch (e) {
        console.error('email_otp_send_failed', e);
      }
    }

    return { userId: user.id, role: user.role };
  }

  async resendOtp(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) return { ok: true };
    await this.sendEmailOtp(email, 'verify', user.id);
    return { ok: true };
  }

  async verifyOtp(code: string) {
    const now = new Date();
    const candidates = await this.prisma.emailOtp.findMany({
      where: {
        purpose: 'verify',
        usedAt: null,
        expiresAt: { gt: now },
      },
      orderBy: { createdAt: 'desc' },
      take: 25,
    });

    for (const otp of candidates) {
      const ok = await bcrypt.compare(code, otp.codeHash);
      if (!ok) continue;

      await this.prisma.$transaction([
        this.prisma.emailOtp.update({
          where: { id: otp.id },
          data: { usedAt: now },
        }),
        this.prisma.user.update({
          where: { id: otp.userId },
          data: { emailVerifiedAt: now },
        }),
      ]);

      return { ok: true };
    }

    throw new BadRequestException('invalid_code');
  }

  async loginWithEmail(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new UnauthorizedException('invalid_credentials');

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) throw new UnauthorizedException('invalid_credentials');

    const accessToken = await this.jwt.signAsync({
      sub: user.id,
      role: user.role,
    });

    return { userId: user.id, accessToken, role: user.role };
  }

  async loginWithPhone(
    phone: string,
    phoneCountryCode: string,
    password: string,
  ) {
    const p = normalizePhone(phone);
    const cc = normalizeCountryCode(phoneCountryCode);
    const user = await this.prisma.user.findFirst({
      where: { phone: p, phoneCountryCode: cc },
    });
    if (!user) throw new UnauthorizedException('invalid_credentials');

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) throw new UnauthorizedException('invalid_credentials');

    const accessToken = await this.jwt.signAsync({
      sub: user.id,
      role: user.role,
    });

    return { userId: user.id, accessToken, role: user.role };
  }

  async sendResetCode(identifier: string) {
    const user = await this.prisma.user.findUnique({
      where: { email: identifier },
    });
    if (!user?.email) return { ok: true };

    const code = randomOtp();
    const codeHash = await bcrypt.hash(code, 10);
    const expiresAt = addMinutes(new Date(), 15);

    await this.prisma.passwordReset.create({
      data: {
        userId: user.id,
        email: user.email,
        codeHash,
        expiresAt,
      },
    });

    await this.mailer.sendOtpEmail(user.email, code, 'reset');
    return { ok: true };
  }

  async verifyResetOtp(code: string) {
    const now = new Date();
    const candidates = await this.prisma.passwordReset.findMany({
      where: { usedAt: null, expiresAt: { gt: now } },
      orderBy: { createdAt: 'desc' },
      take: 25,
    });

    for (const reset of candidates) {
      const ok = await bcrypt.compare(code, reset.codeHash);
      if (!ok) continue;
      return { ok: true };
    }

    throw new BadRequestException('invalid_code');
  }

  async resetPassword(newPassword: string, code?: string) {
    if (!code) throw new BadRequestException('code_required');

    const now = new Date();
    const candidates = await this.prisma.passwordReset.findMany({
      where: { usedAt: null, expiresAt: { gt: now } },
      orderBy: { createdAt: 'desc' },
      take: 25,
    });

    for (const reset of candidates) {
      const ok = await bcrypt.compare(code, reset.codeHash);
      if (!ok) continue;

      const passwordHash = await bcrypt.hash(newPassword, 12);
      await this.prisma.$transaction([
        this.prisma.passwordReset.update({
          where: { id: reset.id },
          data: { usedAt: now },
        }),
        this.prisma.user.update({
          where: { id: reset.userId },
          data: { passwordHash },
        }),
      ]);
      return { ok: true };
    }

    throw new BadRequestException('invalid_code');
  }

  private async sendEmailOtp(email: string, purpose: 'verify', userId: string) {
    const code = randomOtp();
    const codeHash = await bcrypt.hash(code, 10);
    const expiresAt = addMinutes(new Date(), 15);

    await this.prisma.emailOtp.create({
      data: {
        userId,
        email,
        codeHash,
        purpose,
        expiresAt,
      },
    });

    await this.mailer.sendOtpEmail(email, code, 'verify');
  }
}
