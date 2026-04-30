import { Injectable } from '@nestjs/common';
import { EmailProvider } from './providers/email-provider';
import { ResendEmailProvider } from './providers/resend-email.provider';
import { SmtpEmailProvider } from './providers/smtp-email.provider';

@Injectable()
export class MailerService {
  private readonly provider: EmailProvider;

  constructor() {
    const from = process.env.MAIL_FROM ?? 'HHM <no-reply@hhm.local>';
    const provider = (process.env.EMAIL_PROVIDER ?? 'smtp').toLowerCase();

    this.provider =
      provider === 'resend'
        ? new ResendEmailProvider({
            apiKey: process.env.RESEND_API_KEY ?? '',
            from,
          })
        : new SmtpEmailProvider({
            host: process.env.SMTP_HOST ?? '',
            port: Number(process.env.SMTP_PORT ?? '587'),
            user: process.env.SMTP_USER ?? '',
            pass: process.env.SMTP_PASS ?? '',
            secure: (process.env.SMTP_SECURE ?? 'false') === 'true',
            from,
          });
  }

  async sendOtpEmail(email: string, code: string, purpose: 'verify' | 'reset') {
    await this.provider.sendOtp({ to: email, code, purpose });
  }
}
