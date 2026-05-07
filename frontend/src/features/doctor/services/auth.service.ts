import { http } from '@shared/api/http';
import type { DoctorRegisterPayload } from '../types/doctor.types';

type AuthRole = 'PATIENT' | 'DOCTOR' | 'DONOR' | 'ADMIN';

export async function registerDoctor(
  data: DoctorRegisterPayload,
): Promise<{ userId: string; role: AuthRole }> {
  const res = await http.post<{ userId: string; role: AuthRole }>('/auth/doctors/register', data);
  return res.data;
}

export async function loginWithEmail(
  email: string,
  password: string,
): Promise<{ userId: string; accessToken: string; role: AuthRole }> {
  const res = await http.post<{ userId: string; accessToken: string; role: AuthRole }>(
    '/auth/login/email',
    { email, password },
  );
  return res.data;
}

export async function loginWithPhone(
  phone: string,
  phoneCountryCode: string,
  password: string,
): Promise<{ userId: string; accessToken: string; role: AuthRole }> {
  const res = await http.post<{ userId: string; accessToken: string; role: AuthRole }>(
    '/auth/login/phone',
    { phone, phoneCountryCode, password },
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
