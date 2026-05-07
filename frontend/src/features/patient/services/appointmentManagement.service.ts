import { getDoctorSchedule } from './appointmentBooking.service';
import type { PatientAppointment } from '../types/appointmentManagement.types';
import { http } from '@shared/api/http';
import { addMinutes, format, isValid, parse } from 'date-fns';
import { toast } from '@shared/components/ui/toast';

export type {
  AppointmentCalendarMonth,
  AppointmentTimeSlot,
  DoctorAvailabilitySummary,
} from '../types/appointmentBooking.types';

type ApiAppointment = {
  id: string;
  status: 'UPCOMING' | 'COMPLETED' | 'CANCELLED';
  startsAt: string;
  endsAt: string;
  doctor?: {
    id?: string;
    firstName?: string;
    lastName?: string;
    doctorProfile?: { avatarUri?: string | null; specialties?: string[] };
  };
};

export async function fetchAppointments(): Promise<PatientAppointment[]> {
  const res = await http.get<ApiAppointment[]>('/appointments');
  const seen = new Set<string>();
  const unique = res.data.filter((a) => {
    if (!a?.id || seen.has(a.id)) return false;
    seen.add(a.id);
    return true;
  });
  return unique.map((a) => {
    const startsAt = new Date(a.startsAt);
    const doctorName = a.doctor?.firstName || a.doctor?.lastName
      ? `Dr. ${[a.doctor?.firstName, a.doctor?.lastName].filter(Boolean).join(' ')}`
      : 'Doctor';
    const doctorAvatar =
      a.doctor?.doctorProfile?.avatarUri ?? 'https://i.pravatar.cc/150?img=11';
    const specialty = a.doctor?.doctorProfile?.specialties?.[0] ?? '';
    const status =
      a.status === 'CANCELLED'
        ? 'cancelled'
        : a.status === 'COMPLETED'
          ? 'completed'
          : 'upcoming';
    return {
      id: a.id,
      doctorId: a.doctor?.id ?? null,
      doctorName,
      doctorAvatar,
      specialty,
      startsAt: a.startsAt,
      endsAt: a.endsAt,
      date: format(startsAt, 'MMMM d, yyyy'),
      time: format(startsAt, 'h:mm a'),
      status,
      canCancel: status === 'upcoming',
      canReschedule: status === 'upcoming',
    };
  });
}

export async function cancelAppointment(id: string): Promise<void> {
  await http.delete(`/appointments/${id}`);
}

export async function rescheduleAppointment(
  id: string,
  isoDate: string,
  timeSlotId: string,
): Promise<void> {
  const normalized = (() => {
    const raw = timeSlotId.trim();
    const m24 = raw.match(/^([01]?\d|2[0-3]):([0-5]\d)$/);
    if (m24) {
      const h = Number(m24[1]);
      const mm = m24[2];
      const period = h >= 12 ? 'PM' : 'AM';
      const h12 = h % 12 === 0 ? 12 : h % 12;
      return `${String(h12).padStart(2, '0')}:${mm} ${period}`;
    }
    const m12 = raw.match(/^(\d{1,2}):([0-5]\d)\s*([aApP][mM])$/);
    if (m12) {
      const h = Number(m12[1]);
      const mm = m12[2];
      const period = m12[3].toUpperCase();
      if (h < 1 || h > 12) return null;
      return `${String(h).padStart(2, '0')}:${mm} ${period}`;
    }
    const m12NoMinutes = raw.match(/^(\d{1,2})\s*([aApP][mM])$/);
    if (m12NoMinutes) {
      const h = Number(m12NoMinutes[1]);
      const period = m12NoMinutes[2].toUpperCase();
      if (h < 1 || h > 12) return null;
      return `${String(h).padStart(2, '0')}:00 ${period}`;
    }
    return null;
  })();

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

export async function fetchRescheduleSchedule(
  appointmentId: string,
  args?: { year: number; month: number },
) {
  return getDoctorSchedule(appointmentId, args);
}
