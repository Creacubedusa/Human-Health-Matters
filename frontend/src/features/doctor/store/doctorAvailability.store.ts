import { create } from 'zustand';

export type DoctorAvailabilityWeekday =
  | 'sun'
  | 'mon'
  | 'tue'
  | 'wed'
  | 'thu'
  | 'fri'
  | 'sat';

export interface DoctorAvailabilitySlot {
  id: string;
  startTime: string;
  endTime: string;
}

export interface DoctorAvailabilityDay {
  key: DoctorAvailabilityWeekday;
  label: string;
  slots: DoctorAvailabilitySlot[];
}

export interface DoctorAvailabilitySettings {
  fromDate: string;
  toDate: string;
  timeZone: string;
  appointmentDurationMinutes: 15 | 30 | 45 | 60;
  days: DoctorAvailabilityDay[];
  bookingLimits: {
    bufferEnabled: boolean;
    bufferDurationMinutes: 10 | 15 | 30 | 45;
    dailyLimitEnabled: boolean;
    dailyLimit: string;
  };
}

const DAY_LABELS: Record<DoctorAvailabilityWeekday, string> = {
  sun: 'Sun',
  mon: 'Mon',
  tue: 'Tue',
  wed: 'Wed',
  thu: 'Thu',
  fri: 'Fri',
  sat: 'Sat',
};

function toIsoDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function addDays(date: Date, count: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + count);
  return next;
}

function createSlot(id: string, startTime: string, endTime: string): DoctorAvailabilitySlot {
  return { id, startTime, endTime };
}

export function createDefaultDoctorAvailabilitySettings(): DoctorAvailabilitySettings {
  const today = new Date();
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
  return {
    fromDate: toIsoDate(today),
    toDate: toIsoDate(addDays(today, 180)),
    timeZone,
    appointmentDurationMinutes: 30,
    days: [
      { key: 'sun', label: DAY_LABELS.sun, slots: [] },
      { key: 'mon', label: DAY_LABELS.mon, slots: [createSlot('mon-1', '08:00', '16:00')] },
      { key: 'tue', label: DAY_LABELS.tue, slots: [createSlot('tue-1', '08:00', '16:00')] },
      { key: 'wed', label: DAY_LABELS.wed, slots: [createSlot('wed-1', '08:00', '16:00')] },
      { key: 'thu', label: DAY_LABELS.thu, slots: [createSlot('thu-1', '08:00', '16:00')] },
      { key: 'fri', label: DAY_LABELS.fri, slots: [createSlot('fri-1', '08:00', '16:00')] },
      { key: 'sat', label: DAY_LABELS.sat, slots: [] },
    ],
    bookingLimits: {
      bufferEnabled: true,
      bufferDurationMinutes: 30,
      dailyLimitEnabled: true,
      dailyLimit: '4',
    },
  };
}

interface DoctorAvailabilityState {
  settings: DoctorAvailabilitySettings;
  hasSavedAvailability: boolean;
  setSettings: (settings: DoctorAvailabilitySettings) => void;
  hydrate: (settings: DoctorAvailabilitySettings, hasSavedAvailability: boolean) => void;
  reset: () => void;
}

export const useDoctorAvailabilityStore = create<DoctorAvailabilityState>((set) => ({
  settings: createDefaultDoctorAvailabilitySettings(),
  hasSavedAvailability: false,
  setSettings: (settings) => set({ settings, hasSavedAvailability: true }),
  hydrate: (settings, hasSavedAvailability) => set({ settings, hasSavedAvailability }),
  reset: () =>
    set({
      settings: createDefaultDoctorAvailabilitySettings(),
      hasSavedAvailability: false,
    }),
}));
