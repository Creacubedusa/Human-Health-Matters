import { create } from 'zustand';
import type { DonorDashboard } from '../types/donor.types';

interface DonorState {
  dashboard: DonorDashboard | null;
  setDashboard: (data: DonorDashboard) => void;
  clearDashboard: () => void;
}

export const useDonorStore = create<DonorState>((set) => ({
  dashboard: null,
  setDashboard: (data) => set({ dashboard: data }),
  clearDashboard: () => set({ dashboard: null }),
}));
