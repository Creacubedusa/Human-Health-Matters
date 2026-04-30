import { create } from 'zustand';
import type {
  CalendarAppointment,
  CalendarTimeZone,
  CalendarViewMode,
  DisplayCalendarAppointment,
} from '../types/calendar.types';

interface CalendarState {
  appointments: CalendarAppointment[];
  selectedDate: string;
  focusedMonth: string;
  viewMode: CalendarViewMode;
  selectedTimeZoneId: string;
  timeZoneSearch: string;
  selectedAppointment: DisplayCalendarAppointment | null;
  viewMenuOpen: boolean;
  timeZoneModalOpen: boolean;
  detailsOpen: boolean;
  daySelected: boolean;

  setAppointments: (appointments: CalendarAppointment[]) => void;
  setSelectedDate: (dateKey: string) => void;
  setFocusedMonth: (dateKey: string) => void;
  setViewMode: (mode: CalendarViewMode) => void;
  setTimeZone: (timeZone: CalendarTimeZone) => void;
  setTimeZoneSearch: (query: string) => void;
  setSelectedAppointment: (appointment: DisplayCalendarAppointment | null) => void;
  setViewMenuOpen: (open: boolean) => void;
  setTimeZoneModalOpen: (open: boolean) => void;
  setDetailsOpen: (open: boolean) => void;
  setDaySelected: (selected: boolean) => void;
}

const DEFAULT_DATE = '2026-04-01';

export const useCalendarStore = create<CalendarState>((set) => ({
  appointments: [],
  selectedDate: DEFAULT_DATE,
  focusedMonth: DEFAULT_DATE,
  viewMode: 'month',
  selectedTimeZoneId: 'Africa/Lagos',
  timeZoneSearch: '',
  selectedAppointment: null,
  viewMenuOpen: false,
  timeZoneModalOpen: false,
  detailsOpen: false,
  daySelected: false,

  setAppointments: (appointments) => set({ appointments }),
  setSelectedDate: (dateKey) => set({ selectedDate: dateKey }),
  setFocusedMonth: (dateKey) => set({ focusedMonth: dateKey }),
  setViewMode: (mode) => set({ viewMode: mode, viewMenuOpen: false, daySelected: false }),
  setTimeZone: (timeZone) =>
    set({
      selectedTimeZoneId: timeZone.id,
      timeZoneModalOpen: false,
      timeZoneSearch: '',
    }),
  setTimeZoneSearch: (query) => set({ timeZoneSearch: query }),
  setSelectedAppointment: (appointment) =>
    set({
      selectedAppointment: appointment,
      detailsOpen: appointment != null,
    }),
  setViewMenuOpen: (open) => set({ viewMenuOpen: open }),
  setTimeZoneModalOpen: (open) => set({ timeZoneModalOpen: open }),
  setDetailsOpen: (open) => set({ detailsOpen: open }),
  setDaySelected: (selected) => set({ daySelected: selected }),
}));
