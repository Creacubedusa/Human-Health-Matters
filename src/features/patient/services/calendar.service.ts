import { fetchAppointments } from './appointmentManagement.service';
import type { CalendarAppointment, CalendarTimeZone } from '../types/calendar.types';

const MONTH_INDEX: Record<string, number> = {
  January: 0,
  February: 1,
  March: 2,
  April: 3,
  May: 4,
  June: 5,
  July: 6,
  August: 7,
  September: 8,
  October: 9,
  November: 10,
  December: 11,
};

export const CALENDAR_TIME_ZONES: CalendarTimeZone[] = [
  { id: 'UTC', label: '(UTC+00:00) Coordinated Universal Time', offsetLabel: 'UTC', searchLabel: 'utc coordinated universal time' },
  { id: 'Africa/Lagos', label: '(UTC+01:00) Lagos / West Africa Time', offsetLabel: 'WAT', searchLabel: 'lagos west africa time wat nigeria' },
  { id: 'America/New_York', label: '(UTC-05:00) Eastern Time', offsetLabel: 'ET', searchLabel: 'eastern new york america et' },
  { id: 'America/Chicago', label: '(UTC-06:00) Central Time', offsetLabel: 'CT', searchLabel: 'central chicago america ct' },
  { id: 'America/Denver', label: '(UTC-07:00) Mountain Time', offsetLabel: 'MT', searchLabel: 'mountain denver america mt' },
  { id: 'America/Los_Angeles', label: '(UTC-08:00) Pacific Time', offsetLabel: 'PT', searchLabel: 'pacific los angeles america pt' },
  { id: 'Europe/London', label: '(UTC+00:00) London', offsetLabel: 'GMT', searchLabel: 'london europe gmt bst' },
  { id: 'Europe/Paris', label: '(UTC+01:00) Paris', offsetLabel: 'CET', searchLabel: 'paris europe cet' },
  { id: 'Asia/Dubai', label: '(UTC+04:00) Dubai', offsetLabel: 'GST', searchLabel: 'dubai gulf standard time' },
  { id: 'Asia/Kolkata', label: '(UTC+05:30) India Standard Time', offsetLabel: 'IST', searchLabel: 'india kolkata ist' },
  { id: 'Asia/Singapore', label: '(UTC+08:00) Singapore', offsetLabel: 'SGT', searchLabel: 'singapore sgt' },
];

function parseAppointmentDate(dateLabel: string, timeLabel: string): string {
  const [monthName, dayWithComma, yearText] = dateLabel.split(' ');
  const [timeText, meridiem] = timeLabel.split(' ');
  const [hourText, minuteText = '0'] = timeText.split(':');
  const monthIndex = MONTH_INDEX[monthName] ?? 0;
  const day = Number(dayWithComma.replace(',', ''));
  const year = Number(yearText);
  const minute = Number(minuteText);
  const rawHour = Number(hourText);
  const hour =
    meridiem === 'PM' && rawHour !== 12
      ? rawHour + 12
      : meridiem === 'AM' && rawHour === 12
      ? 0
      : rawHour;

  return new Date(Date.UTC(year, monthIndex, day, hour, minute)).toISOString();
}

export async function fetchCalendarAppointments(): Promise<CalendarAppointment[]> {
  const appointments = await fetchAppointments();

  return appointments.map((appointment) => ({
    id: appointment.id,
    doctorName: appointment.doctorName,
    doctorAvatar: appointment.doctorAvatar,
    specialty: appointment.specialty,
    status: appointment.status,
    canCancel: appointment.canCancel,
    canReschedule: appointment.canReschedule,
    description: `Consultation with ${appointment.doctorName}`,
    startsAtUtc: parseAppointmentDate(appointment.date, appointment.time),
    sourceTimeZone: 'UTC',
  }));
}
