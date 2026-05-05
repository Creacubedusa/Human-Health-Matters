export type DonorImpactPatientType = 'adult' | 'child' | 'senior';
export type DonorImpactStatus = 'paid' | 'pending' | 'processing';

export interface DonorImpactPatient {
  id: string;
  patientType: DonorImpactPatientType;
  ageRange: string;
  condition: string;
  amount: number;
  status: DonorImpactStatus;
}

export interface DonorImpactSummary {
  totalImpact: number;
  patientsSupported: number;
  patients: DonorImpactPatient[];
}
