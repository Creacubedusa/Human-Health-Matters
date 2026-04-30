import nodemailer from 'nodemailer';
import { EmailProvider, SendOtpInput } from './email-provider';

type SmtpConfig = {
  host: string;
  port: number;
  user: string;
  pass: string;
  secure: boolean;
  from: string;
};

export class SmtpEmailProvider implements EmailProvider {
  private readonly config: SmtpConfig;

  constructor(config: SmtpConfig) {
    this.config = config;
  }

  async sendOtp(input: SendOtpInput) {
    if (!this.config.host || !this.config.user || !this.config.pass) return;

    const transporter = nodemailer.createTransport({
      host: this.config.host,
      port: this.config.port,
      secure: this.config.secure,
      auth: {
        user: this.config.user,
        pass: this.config.pass,
      },
    });

    const subject =
      input.purpose === 'verify' ? 'Verify your email' : 'Reset your password';
    const text =
      input.purpose === 'verify'
        ? `Your verification code is ${input.code}`
        : `Your password reset code is ${input.code}`;

    await transporter.sendMail({
      from: this.config.from,
      to: input.to,
      subject,
      text,
    });
  }
}
