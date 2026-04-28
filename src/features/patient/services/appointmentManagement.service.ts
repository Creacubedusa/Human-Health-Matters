import { getDoctorSchedule } from './appointmentBooking.service';
import type { PatientAppointment } from '../types/appointmentManagement.types';

export type {
  AppointmentCalendarMonth,
  AppointmentTimeSlot,
  DoctorAvailabilitySummary,
} from '../types/appointmentBooking.types';

const MOCK_APPOINTMENTS: PatientAppointment[] = [
  {
    id: 'apt-001',
    doctorName: 'Dr. Paul Grant',
    doctorAvatar: 'https://i.pravatar.cc/150?img=11',
    specialty: 'Cardiologist',
    date: 'April 1, 2026',
    time: '8:00 AM',
    status: 'upcoming',
    canCancel: true,
    canReschedule: true,
  },
  {
    id: 'apt-002',
    doctorName: 'Dr. Sarah Chen',
    doctorAvatar: 'https://i.pravatar.cc/150?img=47',
    specialty: 'General Practitioner',
    date: 'April 5, 2026',
    time: '10:30 AM',
    status: 'upcoming',
    canCancel: true,
    canReschedule: true,
  },
  {
    id: 'apt-003',
    doctorName: 'Dr. James Okoye',
    doctorAvatar: 'https://i.pravatar.cc/150?img=15',
    specialty: 'Neurologist',
    date: 'March 22, 2026',
    time: '2:00 PM',
    status: 'completed',
    canCancel: false,
    canReschedule: false,
  },
  {
    id: 'apt-004',
    doctorName: 'Dr. Maria Santos',
    doctorAvatar: 'https://i.pravatar.cc/150?img=48',
    specialty: 'Endocrinologist',
    date: 'March 15, 2026',
    time: '11:00 AM',
    status: 'completed',
    canCancel: false,
    canReschedule: false,
  },
  {
    id: 'apt-005',
    doctorName: 'Dr. Kevin Walsh',
    doctorAvatar: 'https://i.pravatar.cc/150?img=12',
    specialty: 'Pulmonologist',
    date: 'March 10, 2026',
    time: '9:00 AM',
    status: 'cancelled',
    canCancel: false,
    canReschedule: false,
  },
];

export async function fetchAppointments(): Promise<PatientAppointment[]> {
  await new Promise<void>((r) => setTimeout(r, 800));
  return [...MOCK_APPOINTMENTS];
}

export async function cancelAppointment(id: string): Promise<void> {
  void id;
  await new Promise<void>((r) => setTimeout(r, 600));
}

export async function rescheduleAppointment(
  id: string,
  isoDate: string,
  timeSlotId: string,
): Promise<void> {
  void id; void isoDate; void timeSlotId;
  await new Promise<void>((r) => setTimeout(r, 600));
}

export { getDoctorSchedule as fetchRescheduleSchedule };
