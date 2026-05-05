import { addMinutes, format, isValid, parse } from 'date-fns';
import { toast } from '@shared/components/ui/toast';
import type { DoctorDashboard } from '../types/doctor.types';
import type { DoctorAvailabilitySummary, DoctorManagedAppointment } from '../types/doctorAppointments.types';
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

export async function fetchDoctorManagedAppointments(): Promise<DoctorManagedAppointment[]> {
  const res = await http.get<DoctorAppointment[]>('/appointments');
  return res.data.map((a) => {
    const startsAt = new Date(a.startsAt);
    const patientName = a.patient?.firstName || a.patient?.lastName
      ? [a.patient?.firstName, a.patient?.lastName].filter(Boolean).join(' ')
      : 'Patient';
    const status =
      a.status === 'CANCELLED'
        ? 'cancelled'
        : a.status === 'COMPLETED'
          ? 'completed'
          : 'upcoming';
    return {
      id: a.id,
      patientName,
      patientAvatar: `https://i.pravatar.cc/150?u=${a.patient?.id ?? a.id}`,
      specialty: '',
      date: format(startsAt, 'MMMM d, yyyy'),
      time: format(startsAt, 'h:mm a'),
      status,
      canCancel: status === 'upcoming',
      canReschedule: status === 'upcoming',
    } as DoctorManagedAppointment;
  });
}

export async function cancelDoctorAppointment(id: string): Promise<void> {
  await http.delete(`/appointments/${id}`);
}

export async function rescheduleDoctorAppointment(
  id: string,
  isoDate: string,
  timeSlotId: string,
): Promise<void> {
  const raw = timeSlotId.trim();
  const m24 = raw.match(/^([01]?\d|2[0-3]):([0-5]\d)$/);
  const m12 = raw.match(/^(\d{1,2}):([0-5]\d)\s*([aApP][mM])$/);
  const m12NoMin = raw.match(/^(\d{1,2})\s*([aApP][mM])$/);

  let normalized: string | null = null;
  if (m24) {
    const h = Number(m24[1]);
    const mm = m24[2];
    const period = h >= 12 ? 'PM' : 'AM';
    const h12 = h % 12 === 0 ? 12 : h % 12;
    normalized = `${String(h12).padStart(2, '0')}:${mm} ${period}`;
  } else if (m12) {
    const h = Number(m12[1]);
    const mm = m12[2];
    const period = m12[3].toUpperCase();
    if (h >= 1 && h <= 12) normalized = `${String(h).padStart(2, '0')}:${mm} ${period}`;
  } else if (m12NoMin) {
    const h = Number(m12NoMin[1]);
    const period = m12NoMin[2].toUpperCase();
    if (h >= 1 && h <= 12) normalized = `${String(h).padStart(2, '0')}:00 ${period}`;
  }

  if (!normalized) {
    toast.error('Enter time like 20:00 or 08:00 PM');
    throw new Error('invalid_time');
  }

  const startsAt = parse(`${isoDate} ${normalized}`, 'yyyy-MM-dd hh:mm a', new Date());
  if (!isValid(startsAt)) {
    toast.error('Invalid time. Use 20:00 or 08:00 PM');
    throw new Error('invalid_time');
  }
  const endsAt = addMinutes(startsAt, 30);
  await http.post(`/appointments/${id}/reschedule`, {
    startsAt: startsAt.toISOString(),
    endsAt: endsAt.toISOString(),
  });
}

export async function fetchDoctorRescheduleSchedule(
  appointmentId: string,
  args?: { year: number; month: number },
): Promise<DoctorAvailabilitySummary> {
  const params = args ? `?year=${args.year}&month=${args.month}` : '';
  const res = await http.get<DoctorAvailabilitySummary>(
    `/appointments/${appointmentId}/schedule${params}`,
  );
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
    medicalCertificate: string | null;
    boardCertificate: string | null;
    deaRegistration: string | null;
    malpracticeInsurance: string | null;
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

export interface UpdateDoctorProfilePayload {
  specialties?: string[];
  bio?: string | null;
  avatarUri?: string | null;
  medicalCertificate?: string | null;
  boardCertificate?: string | null;
  deaRegistration?: string | null;
  malpracticeInsurance?: string | null;
}

export async function setupDoctorProfile(payload: DoctorProfileSetupPayload) {
  const res = await http.patch<{ profile: DoctorProfileResponse['profile'] }>(
    '/doctor/profile/setup',
    payload,
  );
  return res.data;
}

export async function updateDoctorProfile(payload: UpdateDoctorProfilePayload) {
  const res = await http.patch<{ profile: DoctorProfileResponse['profile'] }>(
    '/doctor/profile',
    payload,
  );
  return res.data;
}

// ── Telemedicine / Video ──────────────────────────────────────────────────────

export type DoctorJoinVideoResponse = {
  appointmentId: string;
  roomName: string;
  roomUrl: string;
  token: string;
  expiresAt: string;
};

export async function joinDoctorAppointmentVideo(appointmentId: string): Promise<DoctorJoinVideoResponse> {
  const res = await http.post<DoctorJoinVideoResponse>(`/video/appointments/${appointmentId}/join`);
  return res.data;
}

export function buildDailyJoinUrl(roomUrl: string, token: string): string {
  const url = new URL(roomUrl);
  url.searchParams.set('t', token);
  return url.toString();
}

// ── SOAP Note ─────────────────────────────────────────────────────────────────

export interface SoapNotePayload {
  subjective?: string;
  objective?: string;
  assessment?: string;
  plan?: string;
}

export async function upsertDoctorSoapNote(
  appointmentId: string,
  payload: SoapNotePayload,
): Promise<void> {
  await http.post(`/appointments/${appointmentId}/soap`, payload);
}
