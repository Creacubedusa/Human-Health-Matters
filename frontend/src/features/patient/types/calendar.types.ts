import type { AppointmentStatus } from './appointmentManagement.types';

export type CalendarViewMode = 'day' | 'week' | 'month';

export interface CalendarTimeZone {
  id: string;
  label: string;
  offsetLabel: string;
  searchLabel: string;
}

export interface CalendarAppointment {
  id: string;
  doctorName: string;
  doctorAvatar: string;
  specialty: string;
  status: AppointmentStatus;
  canCancel: boolean;
  canReschedule: boolean;
  description: string;
  startsAtUtc: string;
  sourceTimeZone: string;
}

export interface DisplayCalendarAppointment extends CalendarAppointment {
  displayDateKey: string;
  displayDateLabel: string;
  displayTimeLabel: string;
  displayDateTimeLabel: string;
  displayTimeRangeLabel: string;
}

export interface CalendarDayCell {
  key: string;
  dayNumber: number;
  isCurrentMonth: boolean;
  appointments: DisplayCalendarAppointment[];
}
