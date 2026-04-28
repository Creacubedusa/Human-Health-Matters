import type { DoctorDashboard } from '../types/doctor.types';

// Stub — replace with real API call via shared/api
export async function fetchDoctorDashboard(): Promise<DoctorDashboard> {
  await new Promise((r) => setTimeout(r, 800));
  return {
    doctorName: 'Rivera',
    onboardingStatus: 'complete',
    pendingConsultations: 0,
    weeklyStats: { consultations: 0, patients: 0 },
    recentPatients: [],
  };
}
