import type { DoctorDashboard } from '../types/doctor.types';
import { http } from '@shared/api/http';

export async function fetchDoctorDashboard(): Promise<DoctorDashboard> {
  const res = await http.get<DoctorDashboard>('/doctor/dashboard');
  return res.data;
}

export type DoctorPatientListItem = {
  id: string;
  name: string;
  lastVisit: string;
};

export async function fetchDoctorPatients(): Promise<DoctorPatientListItem[]> {
  const res = await http.get<DoctorPatientListItem[]>('/doctor/patients');
  return res.data;
}

export type DoctorAppointment = {
  id: string;
  status: 'UPCOMING' | 'COMPLETED' | 'CANCELLED';
  startsAt: string;
  endsAt: string;
  patient?: { id: string; firstName: string; lastName: string };
};

export async function fetchDoctorConsultations(): Promise<DoctorAppointment[]> {
  const res = await http.get<DoctorAppointment[]>('/appointments');
  return res.data;
}

export interface DoctorProfileResponse {
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string | null;
    phoneCountryCode: string | null;
    phone: string | null;
  } | null;
  profile: {
    specialties: string[];
    bio: string | null;
    avatarUri: string | null;
    onboardingCompletedAt: string | null;
  } | null;
}

export async function fetchDoctorProfile(): Promise<DoctorProfileResponse> {
  const res = await http.get<DoctorProfileResponse>('/doctor/profile');
  return res.data;
}

export interface DoctorProfileSetupPayload {
  specialties: string[];
  bio?: string;
  avatarUri?: string;
}

export async function setupDoctorProfile(payload: DoctorProfileSetupPayload) {
  const res = await http.patch<{ profile: DoctorProfileResponse['profile'] }>(
    '/doctor/profile/setup',
    payload,
  );
  return res.data;
}
