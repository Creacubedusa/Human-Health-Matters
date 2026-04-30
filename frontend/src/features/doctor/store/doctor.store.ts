import { create } from 'zustand';
import type { DoctorDashboard } from '../types/doctor.types';

interface DoctorState {
  dashboard: DoctorDashboard | null;
  setDashboard: (data: DoctorDashboard) => void;
  clearDashboard: () => void;
}

export const useDoctorStore = create<DoctorState>((set) => ({
  dashboard: null,
  setDashboard: (data) => set({ dashboard: data }),
  clearDashboard: () => set({ dashboard: null }),
}));
