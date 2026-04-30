export type OnboardingStatus = 'complete' | 'incomplete';

export interface RecentPatient {
  id: string;
  name: string;
  lastVisit: string;
  condition?: string;
}

export interface WeeklyStats {
  consultations: number;
  patients: number;
}

export interface DoctorDashboard {
  doctorName: string;
  onboardingStatus: OnboardingStatus;
  pendingConsultations: number;
  weeklyStats: WeeklyStats;
  recentPatients: RecentPatient[];
}
