import { EmailProvider, SendOtpInput } from './email-provider';
import { Resend } from 'resend';

export class ResendEmailProvider implements EmailProvider {
  private readonly apiKey: string;
  private readonly from: string;
  private readonly client: Resend | null;

  constructor(input: { apiKey: string; from: string }) {
    this.apiKey = input.apiKey;
    this.from = input.from;
    this.client = this.apiKey ? new Resend(this.apiKey) : null;
  }

  async sendOtp(input: SendOtpInput) {
    if (!this.client) return;

    const subject =
      input.purpose === 'verify' ? 'Verify your email' : 'Reset your password';
    const text =
      input.purpose === 'verify'
        ? `Your verification code is ${input.code}`
        : `Your password reset code is ${input.code}`;

    const result = await this.client.emails.send({
      from: this.from,
      to: input.to,
      subject,
      text,
    });

    const error = (result as any).error;
    if (error) {
      const message =
        typeof error?.message === 'string'
          ? error.message
          : JSON.stringify(error);
      throw new Error(`resend_send_failed:${message}`);
    }
  }
}
