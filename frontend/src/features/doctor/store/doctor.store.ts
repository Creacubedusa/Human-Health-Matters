import { create } from 'zustand';
import type { DoctorDashboard, DoctorHomeDashboard } from '../types/doctor.types';

interface DoctorState {
  dashboard: DoctorDashboard | null;
  setDashboard: (data: DoctorDashboard) => void;
  clearDashboard: () => void;

  homeDashboard: DoctorHomeDashboard | null;
  setHomeDashboard: (data: DoctorHomeDashboard) => void;
  clearHomeDashboard: () => void;
}

export const useDoctorStore = create<DoctorState>((set) => ({
  dashboard: null,
  setDashboard: (data) => set({ dashboard: data }),
  clearDashboard: () => set({ dashboard: null }),

  homeDashboard: null,
  setHomeDashboard: (data) => set({ homeDashboard: data }),
  clearHomeDashboard: () => set({ homeDashboard: null }),
}));
