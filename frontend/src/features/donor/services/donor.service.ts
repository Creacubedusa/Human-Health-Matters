import type { DonorDashboard } from '../types/donor.types';

// Stub — replace with real API call via shared/api
export async function fetchDonorDashboard(): Promise<DonorDashboard> {
  await new Promise((r) => setTimeout(r, 800));
  return {
    donorName: 'Jordan',
    totalDonated: 0,
    patientsHelped: 0,
    poolBalance: 0,
    recentActivity: [],
  };
}
