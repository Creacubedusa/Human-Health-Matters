import { create } from 'zustand';
import type { AppointmentAccessSnapshot } from '../types/appointmentBooking.types';

interface AppointmentBookingState {
  accessSnapshot: AppointmentAccessSnapshot | null;
  setAccessSnapshot: (snapshot: AppointmentAccessSnapshot) => void;
  clearAccessSnapshot: () => void;
}

export const useAppointmentBookingStore = create<AppointmentBookingState>((set) => ({
  accessSnapshot: null,
  setAccessSnapshot: (snapshot) => set({ accessSnapshot: snapshot }),
  clearAccessSnapshot: () => set({ accessSnapshot: null }),
}));
