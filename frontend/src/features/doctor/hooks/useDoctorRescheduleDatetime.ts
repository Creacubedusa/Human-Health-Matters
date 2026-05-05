import { useEffect, useState } from 'react';
import { rescheduleDoctorAppointment } from '../services/doctor.service';
import { useDoctorAppointmentsStore } from '../store/doctorAppointments.store';
import type {
  AvailabilityDotTone,
  DoctorAppointmentCalendarMonth,
  DoctorAppointmentTimeSlot,
} from '../types/doctorAppointments.types';

type Status = 'loading' | 'error' | 'success';

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
] as const;

const DEFAULT_TIME_SLOTS: DoctorAppointmentTimeSlot[] = [
  { id: '09:00 AM', label: '09:00 AM', available: true },
  { id: '09:30 AM', label: '09:30 AM', available: true },
  { id: '10:00 AM', label: '10:00 AM', available: true },
  { id: '10:30 AM', label: '10:30 AM', available: true },
  { id: '11:00 AM', label: '11:00 AM', available: true },
  { id: '11:30 AM', label: '11:30 AM', available: true },
  { id: '02:00 PM', label: '02:00 PM', available: true },
  { id: '02:30 PM', label: '02:30 PM', available: true },
  { id: '03:00 PM', label: '03:00 PM', available: true },
];

function buildCalendarMonth(year: number, month: number): DoctorAppointmentCalendarMonth {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const firstDay = new Date(year, month - 1, 1);
  const daysInMonth = new Date(year, month, 0).getDate();
  const startDow = firstDay.getDay(); // 0 = Sunday

  const pad = (n: number) => String(n).padStart(2, '0');

  const cells: (import('../types/doctorAppointments.types').DoctorCalendarDayAvailability | null)[] = [];

  for (let i = 0; i < startDow; i++) cells.push(null);

  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(year, month - 1, d);
    const isoDate = `${year}-${pad(month)}-${pad(d)}`;
    const isWeekend = date.getDay() === 0 || date.getDay() === 6;
    const isPast = date < today;
    const isAvailable = !isPast && !isWeekend;
    const dots: AvailabilityDotTone[] = isAvailable ? ['blue'] : [];

    cells.push({
      key: isoDate,
      isoDate,
      dayNumber: d,
      isCurrentMonth: true,
      isAvailable,
      availabilityDots: dots,
    });
  }

  while (cells.length % 7 !== 0) cells.push(null);

  const weeks: Array<Array<import('../types/doctorAppointments.types').DoctorCalendarDayAvailability | null>> = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));

  return {
    key: `${year}-${month}`,
    label: `${MONTH_NAMES[month - 1]} ${year}`,
    weeks,
  };
}

function buildTimeSlotsByDate(
  year: number,
  month: number,
): Record<string, DoctorAppointmentTimeSlot[]> {
  const pad = (n: number) => String(n).padStart(2, '0');
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const daysInMonth = new Date(year, month, 0).getDate();
  const result: Record<string, DoctorAppointmentTimeSlot[]> = {};

  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(year, month - 1, d);
    const isWeekend = date.getDay() === 0 || date.getDay() === 6;
    const isPast = date < today;
    if (!isPast && !isWeekend) {
      result[`${year}-${pad(month)}-${pad(d)}`] = DEFAULT_TIME_SLOTS;
    }
  }
  return result;
}

export function useDoctorRescheduleDatetime() {
  const store = useDoctorAppointmentsStore();
  const [status, setStatus] = useState<Status>('loading');
  const [calendarMonth, setCalendarMonth] = useState<DoctorAppointmentCalendarMonth | null>(null);
  const [timeSlotsByDate, setTimeSlotsByDate] = useState<Record<string, DoctorAppointmentTimeSlot[]>>({});
  const [cursor, setCursor] = useState<{ year: number; month: number } | null>(null);

  function loadSchedule(next?: { year: number; month: number }) {
    if (!store.selectedId) {
      setCalendarMonth(null);
      setTimeSlotsByDate({});
      setStatus('error');
      return;
    }

    setStatus('loading');
    const now = new Date();
    const requested = next ?? cursor ?? { year: now.getFullYear(), month: now.getMonth() + 1 };

    const month = buildCalendarMonth(requested.year, requested.month);
    const slots = buildTimeSlotsByDate(requested.year, requested.month);

    setCalendarMonth(month);
    setTimeSlotsByDate(slots);
    setCursor(requested);
    setStatus('success');
  }

  useEffect(() => {
    loadSchedule();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [store.selectedId]);

  const timeSlots = store.selectedDate ? (timeSlotsByDate[store.selectedDate] ?? []) : [];

  async function handleMakeAppointment(onSuccess: () => void) {
    if (!store.selectedId || !store.selectedDate || !store.selectedTimeSlotId) return;
    await rescheduleDoctorAppointment(store.selectedId, store.selectedDate, store.selectedTimeSlotId);
    store.applyReschedule(store.selectedDate, store.selectedTimeSlotId);
    onSuccess();
  }

  function handlePrevMonth() {
    if (!cursor) return;
    const now = new Date();
    let { year, month } = cursor;
    month -= 1;
    if (month < 1) { month = 12; year -= 1; }
    if (year < now.getFullYear() || (year === now.getFullYear() && month < now.getMonth() + 1)) return;
    store.setSelectedDate(null);
    store.setSelectedTimeSlot(null);
    loadSchedule({ year, month });
  }

  function handleNextMonth() {
    if (!cursor) return;
    let { year, month } = cursor;
    month += 1;
    if (month > 12) { month = 1; year += 1; }
    store.setSelectedDate(null);
    store.setSelectedTimeSlot(null);
    loadSchedule({ year, month });
  }

  return {
    status,
    hasSelectedAppointment: !!store.selectedId,
    calendarMonth,
    timeSlots,
    selectedDate: store.selectedDate,
    selectedTimeSlotId: store.selectedTimeSlotId,
    canMakeAppointment: !!store.selectedDate && !!store.selectedTimeSlotId,
    setSelectedDate: store.setSelectedDate,
    setSelectedTimeSlot: store.setSelectedTimeSlot,
    handleMakeAppointment,
    handlePrevMonth,
    handleNextMonth,
    retry: loadSchedule,
  };
}
