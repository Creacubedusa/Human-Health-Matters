export type SendOtpInput = {
  to: string;
  code: string;
  purpose: 'verify' | 'reset';
};

export interface EmailProvider {
  sendOtp(input: SendOtpInput): Promise<void>;
}
