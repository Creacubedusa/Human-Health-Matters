import { create } from 'zustand';
import type { PatientHomeDashboard } from '../types/patient.types';
import type { ProfileForm } from '../types/profile.types';
import type { PatientProfileOverview } from '../types/profileOverview.types';

interface PatientState {
  dashboard: PatientHomeDashboard | null;
  setupProfile: ProfileForm | null;
  profile: ProfileForm | null;
  profileOverview: PatientProfileOverview | null;
  setDashboard: (data: PatientHomeDashboard) => void;
  clearDashboard: () => void;
  setProfile: (data: ProfileForm) => void;
  setProfileOverview: (data: PatientProfileOverview) => void;
  updateProfileOverview: (data: Partial<PatientProfileOverview>) => void;
}

export const usePatientStore = create<PatientState>((set) => ({
  dashboard: null,
  setupProfile: null,
  profile: null,
  profileOverview: null,
  setDashboard: (data) => set({ dashboard: data }),
  clearDashboard: () => set({ dashboard: null }),
  setProfile: (data) => set((state) => ({
    setupProfile: data,
    profile: data,
    profileOverview: state.profileOverview
      ? { ...state.profileOverview, isProfileComplete: true }
      : state.profileOverview,
  })),
  setProfileOverview: (data) => set({ profileOverview: data }),
  updateProfileOverview: (data) => set((state) => ({
    profileOverview: state.profileOverview
      ? { ...state.profileOverview, ...data }
      : state.profileOverview,
  })),
}));
