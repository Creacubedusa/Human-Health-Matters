import { getDoctorSchedule } from './appointmentBooking.service';
import type { PatientAppointment } from '../types/appointmentManagement.types';
import { http } from '@shared/api/http';
import { addMinutes, format, parse } from 'date-fns';

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
  doctor?: { firstName?: string; lastName?: string };
};

export async function fetchAppointments(): Promise<PatientAppointment[]> {
  const res = await http.get<ApiAppointment[]>('/appointments');
  return res.data.map((a) => {
    const startsAt = new Date(a.startsAt);
    const doctorName = a.doctor?.firstName || a.doctor?.lastName
      ? `Dr. ${[a.doctor?.firstName, a.doctor?.lastName].filter(Boolean).join(' ')}`
      : 'Doctor';
    const status =
      a.status === 'CANCELLED'
        ? 'cancelled'
        : a.status === 'COMPLETED'
          ? 'completed'
          : 'upcoming';
    return {
      id: a.id,
      doctorName,
      doctorAvatar: 'https://i.pravatar.cc/150?img=11',
      specialty: '',
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
  const startsAt = parse(`${isoDate} ${timeSlotId}`, 'yyyy-MM-dd hh:mm a', new Date());
  const endsAt = addMinutes(startsAt, 30);
  await http.post(`/appointments/${id}/reschedule`, {
    startsAt: startsAt.toISOString(),
    endsAt: endsAt.toISOString(),
  });
}

export { getDoctorSchedule as fetchRescheduleSchedule };
