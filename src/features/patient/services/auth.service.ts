import type { PatientSignUpPayload } from '../types/patient.types';

export async function registerPatient(
  data: PatientSignUpPayload,
): Promise<{ userId: string }> {
  // Stub — replace with real API call via shared/api
  void data;
  await new Promise<void>((r) => setTimeout(r, 1200));
  return { userId: 'patient_123' };
}

export async function verifyOtp(code: string): Promise<void> {
  // Stub — replace with real API call via shared/api
  void code;
  await new Promise<void>((r) => setTimeout(r, 1000));
  // Throw to simulate wrong code: throw new Error('invalid_code');
}

export async function resendOtp(email: string): Promise<void> {
  // Stub — replace with real API call via shared/api
  void email;
  await new Promise<void>((r) => setTimeout(r, 800));
}

export async function loginWithEmail(
  email: string,
  password: string,
): Promise<{ userId: string }> {
  void email; void password;
  await new Promise<void>((r) => setTimeout(r, 1200));
  return { userId: 'patient_123' };
}

export async function loginWithPhone(
  phone: string,
  password: string,
): Promise<{ userId: string }> {
  void phone; void password;
  await new Promise<void>((r) => setTimeout(r, 1200));
  return { userId: 'patient_123' };
}

export async function sendResetCode(identifier: string): Promise<void> {
  void identifier;
  await new Promise<void>((r) => setTimeout(r, 1000));
}

export async function verifyResetOtp(code: string): Promise<void> {
  void code;
  await new Promise<void>((r) => setTimeout(r, 1000));
}

export async function resetPassword(newPassword: string): Promise<void> {
  void newPassword;
  await new Promise<void>((r) => setTimeout(r, 1000));
}
