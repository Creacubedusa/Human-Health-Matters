export interface DonorLiveActivity {
  id: string;
  diagnosis: string;
  patientType: string;
  amount: number;
  timeLabel: string;
}

export interface DonorDashboard {
  donorName: string;
  careFunding: number;
  patientsHelped: number;
  impactRate: number;
  poolBalance: number;
  poolProgress: number;
  liveActivity: DonorLiveActivity[];
}
