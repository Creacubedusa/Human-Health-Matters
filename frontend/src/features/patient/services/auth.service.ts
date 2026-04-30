import type { PatientSignUpPayload } from '../types/patient.types';
import { http } from '@shared/api/http';

export async function registerPatient(
  data: PatientSignUpPayload,
): Promise<{ userId: string; role: 'PATIENT' | 'DOCTOR' | 'DONOR' | 'ADMIN' }> {
  const res = await http.post<{ userId: string; role: 'PATIENT' | 'DOCTOR' | 'DONOR' | 'ADMIN' }>(
    '/auth/patients/register',
    data,
  );
  return res.data;
}

export async function registerDoctor(
  data: PatientSignUpPayload,
): Promise<{ userId: string; role: 'PATIENT' | 'DOCTOR' | 'DONOR' | 'ADMIN' }> {
  const res = await http.post<{ userId: string; role: 'PATIENT' | 'DOCTOR' | 'DONOR' | 'ADMIN' }>(
    '/auth/doctors/register',
    data,
  );
  return res.data;
}

export async function verifyOtp(code: string): Promise<void> {
  await http.post('/auth/otp/verify', { code });
}

export async function resendOtp(email: string): Promise<void> {
  await http.post('/auth/otp/resend', { email });
}

export async function loginWithEmail(
  email: string,
  password: string,
): Promise<{ userId: string; accessToken: string; role: 'PATIENT' | 'DOCTOR' | 'DONOR' | 'ADMIN' }> {
  const res = await http.post<{ userId: string; accessToken: string; role: 'PATIENT' | 'DOCTOR' | 'DONOR' | 'ADMIN' }>(
    '/auth/login/email',
    { email, password },
  );
  return res.data;
}

export async function loginWithPhone(
  phone: string,
  phoneCountryCode: string,
  password: string,
): Promise<{ userId: string; accessToken: string; role: 'PATIENT' | 'DOCTOR' | 'DONOR' | 'ADMIN' }> {
  const res = await http.post<{ userId: string; accessToken: string; role: 'PATIENT' | 'DOCTOR' | 'DONOR' | 'ADMIN' }>(
    '/auth/login/phone',
    {
    phone,
    phoneCountryCode,
    password,
    },
  );
  return res.data;
}

export async function sendResetCode(identifier: string): Promise<void> {
  await http.post('/auth/password/reset/request', { identifier });
}

export async function verifyResetOtp(code: string): Promise<void> {
  await http.post('/auth/password/reset/verify', { code });
}

export async function resetPassword(newPassword: string, code: string): Promise<void> {
  await http.post('/auth/password/reset/confirm', { newPassword, code });
}
