import { create } from 'zustand';
import type { PatientHomeDashboard } from '../types/patient.types';
import { INITIAL_PROFILE_FORM, type ProfileForm } from '../types/profile.types';
import type { PatientProfileOverview } from '../types/profileOverview.types';
import type { MedicationEditableFields } from '../types/medication.types';
import type { PatientHistoryEditableFields } from '../types/patientHistory.types';
import {
  normalizeMedicationProfile,
  syncMedicationMedicalRecord,
} from '../utils/medication';
import { syncPatientHistoryMedicalRecord } from '../utils/patientHistory';

interface PatientState {
  dashboard: PatientHomeDashboard | null;
  setupProfile: ProfileForm | null;
  profile: ProfileForm | null;
  profileOverview: PatientProfileOverview | null;
  setDashboard: (data: PatientHomeDashboard) => void;
  clearDashboard: () => void;
  setProfile: (data: ProfileForm) => void;
  updateProfileHistory: (data: Partial<PatientHistoryEditableFields>) => void;
  updateProfileMedication: (data: Partial<MedicationEditableFields>) => void;
  setProfileOverview: (data: PatientProfileOverview) => void;
  updateProfileOverview: (data: Partial<PatientProfileOverview>) => void;
}

function syncProfileMedicalRecords(
  overview: PatientProfileOverview | null,
  profile: ProfileForm,
): PatientProfileOverview | null {
  if (!overview) return overview;

  const withHistory = syncPatientHistoryMedicalRecord(overview.medicalRecords, profile);
  const withMedication = syncMedicationMedicalRecord(withHistory, profile);

  return {
    ...overview,
    isProfileComplete: true,
    medicalRecords: withMedication,
  };
}

export const usePatientStore = create<PatientState>((set) => ({
  dashboard: null,
  setupProfile: null,
  profile: null,
  profileOverview: null,
  setDashboard: (data) => set({ dashboard: data }),
  clearDashboard: () => set({ dashboard: null }),
  setProfile: (data) => set((state) => {
    const normalizedProfile = normalizeMedicationProfile(data);

    return {
      setupProfile: normalizedProfile,
      profile: normalizedProfile,
      profileOverview: syncProfileMedicalRecords(state.profileOverview, normalizedProfile),
    };
  }),
  updateProfileHistory: (data) => set((state) => {
    const baseProfile = normalizeMedicationProfile(
      state.profile ?? state.setupProfile ?? INITIAL_PROFILE_FORM,
    );
    const nextProfile = { ...baseProfile, ...data };

    return {
      setupProfile: nextProfile,
      profile: nextProfile,
      profileOverview: syncProfileMedicalRecords(state.profileOverview, nextProfile),
    };
  }),
  updateProfileMedication: (data) => set((state) => {
    const baseProfile = normalizeMedicationProfile(
      state.profile ?? state.setupProfile ?? INITIAL_PROFILE_FORM,
    );
    const nextProfile = normalizeMedicationProfile({
      ...baseProfile,
      ...data,
    });

    return {
      setupProfile: nextProfile,
      profile: nextProfile,
      profileOverview: syncProfileMedicalRecords(state.profileOverview, nextProfile),
    };
  }),
  setProfileOverview: (data) => set({ profileOverview: data }),
  updateProfileOverview: (data) => set((state) => ({
    profileOverview: state.profileOverview
      ? { ...state.profileOverview, ...data }
      : state.profileOverview,
  })),
}));
