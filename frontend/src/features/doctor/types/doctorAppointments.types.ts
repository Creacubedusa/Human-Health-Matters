export type DoctorAppointmentStatus = 'upcoming' | 'completed' | 'cancelled';
export type DoctorAppointmentActionType = 'cancel' | 'reschedule';

export interface DoctorManagedAppointment {
  id: string;
  patientName: string;
  patientAvatar: string;
  specialty: string;
  date: string;
  time: string;
  status: DoctorAppointmentStatus;
  canCancel: boolean;
  canReschedule: boolean;
}

export type DoctorCancelReason =
  | 'medical_emergency'
  | 'doctor_illness'
  | 'personal_emergency'
  | 'scheduling_error'
  | 'unexpected_travel'
  | 'others';

export type DoctorRescheduleReason =
  | 'unexpected_duty'
  | 'personal_emergency'
  | 'health_issue'
  | 'scheduling_conflict'
  | 'others';

export type AvailabilityDotTone = 'blue' | 'green' | 'yellow';

export interface DoctorCalendarDayAvailability {
  key: string;
  isoDate: string;
  dayNumber: number;
  isCurrentMonth: boolean;
  isAvailable: boolean;
  availabilityDots: AvailabilityDotTone[];
}

export interface DoctorAppointmentCalendarMonth {
  key: string;
  label: string;
  weeks: Array<Array<DoctorCalendarDayAvailability | null>>;
}

export interface DoctorAppointmentTimeSlot {
  id: string;
  label: string;
  available: boolean;
}

export interface DoctorAvailabilitySummary {
  month: DoctorAppointmentCalendarMonth;
  timeSlotsByDate: Record<string, DoctorAppointmentTimeSlot[]>;
}
