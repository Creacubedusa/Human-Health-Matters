import type { DonorImpactSummary } from '../types/donorImpact.types';

export async function fetchDonorImpact(): Promise<DonorImpactSummary> {
  await new Promise((r) => setTimeout(r, 800));
  return {
    totalImpact: 1000,
    patientsSupported: 24,
    patients: [
      {
        id: '1',
        patientType: 'adult',
        ageRange: '30 years',
        condition: 'Consultation for difficulty in breathing',
        amount: 100,
        status: 'paid',
      },
      {
        id: '2',
        patientType: 'child',
        ageRange: '8 years',
        condition: 'Diabetes management consultation',
        amount: 55,
        status: 'paid',
      },
      {
        id: '3',
        patientType: 'senior',
        ageRange: '65 years',
        condition: 'Hypertension follow-up and medication review',
        amount: 40,
        status: 'pending',
      },
      {
        id: '4',
        patientType: 'adult',
        ageRange: '45 years',
        condition: 'Chest pain assessment and ECG review',
        amount: 80,
        status: 'paid',
      },
      {
        id: '5',
        patientType: 'adult',
        ageRange: '38 years',
        condition: 'Mental health support consultation',
        amount: 60,
        status: 'processing',
      },
    ],
  };
}
