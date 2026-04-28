import { create } from 'zustand';
import type { PatientHomeDashboard } from '../types/patient.types';
import type { ProfileForm } from '../types/profile.types';

interface PatientState {
  dashboard: PatientHomeDashboard | null;
  profile: ProfileForm | null;
  setDashboard: (data: PatientHomeDashboard) => void;
  clearDashboard: () => void;
  setProfile: (data: ProfileForm) => void;
}

export const usePatientStore = create<PatientState>((set) => ({
  dashboard: null,
  profile: null,
  setDashboard: (data) => set({ dashboard: data }),
  clearDashboard: () => set({ dashboard: null }),
  setProfile: (data) => set({ profile: data }),
}));
