export interface DonationActivity {
  id: string;
  amount: number;
  date: string;
  patientInitials?: string;
}

export interface DonorDashboard {
  donorName: string;
  totalDonated: number;
  patientsHelped: number;
  poolBalance: number;
  recentActivity: DonationActivity[];
}
