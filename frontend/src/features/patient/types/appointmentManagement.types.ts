export type AppointmentStatus = 'upcoming' | 'completed' | 'cancelled';
export type AppointmentActionType = 'cancel' | 'reschedule';

export interface PatientAppointment {
  id: string;
  doctorName: string;
  doctorAvatar: string;
  specialty: string;
  date: string;
  time: string;
  status: AppointmentStatus;
  canCancel: boolean;
  canReschedule: boolean;
}

export type CancelReason =
  | 'recovered'
  | 'bad_service'
  | 'bad_doctor'
  | 'no_disclose'
  | 'others';

export type RescheduleReason =
  | 'important_event'
  | 'not_available'
  | 'no_disclose'
  | 'nothing'
  | 'others';
