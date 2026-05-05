import type { DonorSignUpPayload } from '../types/donorAuth.types';

type AuthRole = 'PATIENT' | 'DOCTOR' | 'DONOR' | 'ADMIN';

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function registerDonor(
  _data: DonorSignUpPayload,
): Promise<{ userId: string; role: AuthRole }> {
  await delay(900);
  return { userId: 'donor-mock-001', role: 'DONOR' };
}

export async function donorLoginWithEmail(
  _email: string,
  _password: string,
): Promise<{ userId: string; accessToken: string; role: AuthRole }> {
  await delay(900);
  return { userId: 'donor-mock-001', accessToken: 'mock-donor-token', role: 'DONOR' };
}

export async function verifyDonorOtp(_code: string): Promise<void> {
  await delay(800);
}

export async function resendDonorOtp(_email: string): Promise<void> {
  await delay(800);
}

export async function sendDonorResetCode(_email: string): Promise<void> {
  await delay(800);
}

export async function verifyDonorResetOtp(_code: string): Promise<void> {
  await delay(800);
}

export async function resetDonorPassword(_newPassword: string, _code: string): Promise<void> {
  await delay(800);
}
