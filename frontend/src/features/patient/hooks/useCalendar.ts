import { useEffect, useMemo, useState } from 'react';
import {
  CALENDAR_TIME_ZONES,
  fetchCalendarAppointments,
} from '../services/calendar.service';
import { useCalendarStore } from '../store/calendar.store';
import type {
  CalendarDayCell,
  CalendarTimeZone,
  CalendarViewMode,
  DisplayCalendarAppointment,
} from '../types/calendar.types';

type CalendarStatus = 'loading' | 'error' | 'success';

const WEEKDAY_KEYS = [
  'appointmentBooking.weekdays.sun',
  'appointmentBooking.weekdays.mon',
  'appointmentBooking.weekdays.tue',
  'appointmentBooking.weekdays.wed',
  'appointmentBooking.weekdays.thu',
  'appointmentBooking.weekdays.fri',
  'appointmentBooking.weekdays.sat',
] as const;

const DAY_HOURS = Array.from({ length: 13 }, (_, index) => index + 7);

function pad(value: number): string {
  return value.toString().padStart(2, '0');
}

function toDateKey(date: Date): string {
  return `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(date.getUTCDate())}`;
}

function fromDateKey(dateKey: string): Date {
  const [year, month, day] = dateKey.split('-').map(Number);
  return new Date(Date.UTC(year, month - 1, day));
}

function addDays(dateKey: string, days: number): string {
  const date = fromDateKey(dateKey);
  date.setUTCDate(date.getUTCDate() + days);
  return toDateKey(date);
}

function addMonths(dateKey: string, months: number): string {
  const date = fromDateKey(dateKey);
  date.setUTCMonth(date.getUTCMonth() + months, 1);
  return toDateKey(date);
}

function startOfWeek(dateKey: string): string {
  const date = fromDateKey(dateKey);
  date.setUTCDate(date.getUTCDate() - date.getUTCDay());
  return toDateKey(date);
}

function getDateKeyInTimeZone(isoDate: string, timeZone: string): string {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(new Date(isoDate));

  const year = parts.find((part) => part.type === 'year')?.value ?? '2026';
  const month = parts.find((part) => part.type === 'month')?.value ?? '01';
  const day = parts.find((part) => part.type === 'day')?.value ?? '01';
  return `${year}-${month}-${day}`;
}

function formatDateLabel(dateKey: string): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(fromDateKey(dateKey));
}

function formatMonthLabel(dateKey: string): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(fromDateKey(dateKey));
}

function formatTimeLabel(isoDate: string, timeZone: string): string {
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZone,
  }).format(new Date(isoDate));
}

function formatAgendaTimeRange(isoDate: string, timeZone: string): string {
  const start = new Date(isoDate);
  const end = new Date(start.getTime() + 30 * 60 * 1000);
  const formatter = new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    timeZone,
  });
  const clean = (value: string) => value.replace(/\s/g, '').toLowerCase();
  return `${clean(formatter.format(start))} - ${clean(formatter.format(end))}`;
}

function buildMonthCells(
  focusedMonth: string,
  appointments: DisplayCalendarAppointment[],
): CalendarDayCell[][] {
  const monthDate = fromDateKey(focusedMonth);
  const year = monthDate.getUTCFullYear();
  const month = monthDate.getUTCMonth();
  const firstOfMonth = new Date(Date.UTC(year, month, 1));
  const startOffset = firstOfMonth.getUTCDay();
  const start = new Date(firstOfMonth);
  start.setUTCDate(firstOfMonth.getUTCDate() - startOffset);

  const weeks: CalendarDayCell[][] = [];

  for (let week = 0; week < 6; week += 1) {
    const cells: CalendarDayCell[] = [];
    for (let day = 0; day < 7; day += 1) {
      const cellDate = new Date(start);
      cellDate.setUTCDate(start.getUTCDate() + week * 7 + day);
      const key = toDateKey(cellDate);
      cells.push({
        key,
        dayNumber: cellDate.getUTCDate(),
        isCurrentMonth: cellDate.getUTCMonth() === month,
        appointments: appointments.filter((appointment) => appointment.displayDateKey === key),
      });
    }
    weeks.push(cells);
  }

  return weeks;
}

function hasAppointmentsOnSelectedDate(
  dateKey: string,
  appointments: DisplayCalendarAppointment[],
): boolean {
  return appointments.some((appointment) => appointment.displayDateKey === dateKey);
}

export function useCalendar() {
  const store = useCalendarStore();
  const [status, setStatus] = useState<CalendarStatus>(
    store.appointments.length > 0 ? 'success' : 'loading',
  );

  async function load(): Promise<void> {
    setStatus('loading');
    try {
      const appointments = await fetchCalendarAppointments();
      store.setAppointments(appointments);
      setStatus('success');
    } catch {
      setStatus('error');
    }
  }

  useEffect(() => {
    if (store.appointments.length === 0) {
      load();
    }
  }, []);

  const selectedTimeZone =
    CALENDAR_TIME_ZONES.find((timeZone) => timeZone.id === store.selectedTimeZoneId) ??
    CALENDAR_TIME_ZONES[0];

  const appointments = useMemo<DisplayCalendarAppointment[]>(
    () =>
      store.appointments.map((appointment) => {
        const displayDateKey = getDateKeyInTimeZone(appointment.startsAtUtc, selectedTimeZone.id);
        const displayDateLabel = formatDateLabel(displayDateKey);
        const displayTimeLabel = formatTimeLabel(appointment.startsAtUtc, selectedTimeZone.id);

        return {
          ...appointment,
          displayDateKey,
          displayDateLabel,
          displayTimeLabel,
          displayDateTimeLabel: `${displayDateLabel} ${displayTimeLabel}`,
          displayTimeRangeLabel: formatAgendaTimeRange(appointment.startsAtUtc, selectedTimeZone.id),
        };
      }),
    [store.appointments, selectedTimeZone.id],
  );

  const selectedDayAppointments = appointments.filter(
    (appointment) => appointment.displayDateKey === store.selectedDate,
  );

  const weekStart = startOfWeek(store.selectedDate);
  const weekDays = Array.from({ length: 7 }, (_, index) => {
    const key = addDays(weekStart, index);
    return {
      key,
      label: formatDateLabel(key),
      appointments: appointments.filter((appointment) => appointment.displayDateKey === key),
    };
  });

  const monthCells = buildMonthCells(store.focusedMonth, appointments);
  const selectedAppointment =
    appointments.find((appointment) => appointment.id === store.selectedAppointment?.id) ??
    store.selectedAppointment;

  const filteredTimeZones = CALENDAR_TIME_ZONES.filter((timeZone) =>
    timeZone.searchLabel.includes(store.timeZoneSearch.trim().toLowerCase()),
  );

  function selectDate(dateKey: string): void {
    const dayAppointments = appointments.filter(
      (appointment) => appointment.displayDateKey === dateKey,
    );
    store.setSelectedDate(dateKey);
    store.setFocusedMonth(dateKey);
    store.setDaySelected(true);
    if (dayAppointments.length > 0) {
      store.setSelectedAppointment(dayAppointments[0]);
    }
    store.setDetailsOpen(false);
  }

  function selectAppointment(appointment: DisplayCalendarAppointment): void {
    store.setSelectedDate(appointment.displayDateKey);
    store.setFocusedMonth(appointment.displayDateKey);
    store.setSelectedAppointment(appointment);
  }

  function navigatePrevious(): void {
    if (store.viewMode === 'month') {
      const nextMonth = addMonths(store.focusedMonth, -1);
      store.setFocusedMonth(nextMonth);
      store.setDaySelected(false);
      return;
    }

    store.setSelectedDate(addDays(store.selectedDate, store.viewMode === 'week' ? -7 : -1));
  }

  function navigateNext(): void {
    if (store.viewMode === 'month') {
      const nextMonth = addMonths(store.focusedMonth, 1);
      store.setFocusedMonth(nextMonth);
      store.setDaySelected(false);
      return;
    }

    store.setSelectedDate(addDays(store.selectedDate, store.viewMode === 'week' ? 7 : 1));
  }

  return {
    status,
    viewMode: store.viewMode,
    viewMenuOpen: store.viewMenuOpen,
    daySelected: store.daySelected,
    selectedDate: store.selectedDate,
    selectedDateLabel: formatDateLabel(store.selectedDate),
    focusedMonthLabel: formatMonthLabel(store.focusedMonth),
    focusedMonthDateLabel: formatDateLabel(store.focusedMonth),
    selectedTimeZone,
    timeZoneSearch: store.timeZoneSearch,
    timeZoneModalOpen: store.timeZoneModalOpen,
    detailsOpen: store.detailsOpen,
    selectedAppointment,
    appointments,
    selectedDayAppointments,
    selectedDateHasAppointments: hasAppointmentsOnSelectedDate(store.selectedDate, appointments),
    weekDays,
    monthCells,
    dayHours: DAY_HOURS,
    weekdayKeys: WEEKDAY_KEYS,
    filteredTimeZones,
    retry: load,
    selectDate,
    selectAppointment,
    navigatePrevious,
    navigateNext,
    setViewMode: (mode: CalendarViewMode) => store.setViewMode(mode),
    setViewMenuOpen: store.setViewMenuOpen,
    setTimeZoneModalOpen: store.setTimeZoneModalOpen,
    setTimeZoneSearch: store.setTimeZoneSearch,
    setTimeZone: (timeZone: CalendarTimeZone) => store.setTimeZone(timeZone),
    closeDetails: () => store.setDetailsOpen(false),
  };
}
