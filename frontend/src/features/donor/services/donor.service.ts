import type { DonorDashboard } from '../types/donor.types';

export async function fetchDonorDashboard(): Promise<DonorDashboard> {
  await new Promise((r) => setTimeout(r, 800));
  return {
    donorName: 'Sarah',
    careFunding: 1000,
    patientsHelped: 20,
    impactRate: 100,
    poolBalance: 10000,
    poolProgress: 0.6,
    liveActivity: [
      { id: '1', diagnosis: 'Chest Assessment Pain', patientType: 'Underinsured · Emergency', amount: 55, timeLabel: 'Just now' },
      { id: '2', diagnosis: 'Chest Assessment Pain', patientType: 'Underinsured · Emergency', amount: 55, timeLabel: '2 min ago' },
      { id: '3', diagnosis: 'Diabetes Management', patientType: 'Uninsured · Moderate', amount: 40, timeLabel: '5 min ago' },
      { id: '4', diagnosis: 'Hypertension Review', patientType: 'Underinsured · Low', amount: 30, timeLabel: '8 min ago' },
    ],
  };
}
