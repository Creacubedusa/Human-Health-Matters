export type ProfileRecordId =
  | 'patient-history'
  | 'medication'
  | 'appointment'
  | 'order'
  | 'tests'
  | 'prescription'
  | 'medical-docs';

export interface ProfileMetric {
  label: string;
  value: string;
}

export interface ProfileDetailItem {
  id: 'phone' | 'email' | 'address' | 'nationality';
  label: string;
  value: string;
}

export interface MedicalRecordSection {
  id: ProfileRecordId;
  title: string;
  summary: string;
  details: string[];
}

export interface HealthcareSupport {
  applied: boolean;
  title: string;
  subtitle: string;
  report: string[];
}

<<<<<<< HEAD:src/features/patient/types/profileOverview.types.ts
export type SupportActivityStatus = 'applied' | 'pending';

export interface SupportActivity {
  id: string;
  consultationTitle: string;
  amount: string;
  date: string;
  status: SupportActivityStatus;
}

export interface HealthcareSupportData {
  totalSupportReceived: string;
  totalCareVisits: number;
  supportActivityList: SupportActivity[];
}

=======
>>>>>>> 290025c34b3930e6341a697d4a0c37e6f2562012:frontend/src/features/patient/types/profileOverview.types.ts
export interface PatientProfileOverview {
  isProfileComplete: boolean;
  avatarUri: string;
  name: string;
  gender: string;
<<<<<<< HEAD:src/features/patient/types/profileOverview.types.ts
  dateOfBirth: string;
=======
>>>>>>> 290025c34b3930e6341a697d4a0c37e6f2562012:frontend/src/features/patient/types/profileOverview.types.ts
  height: string;
  weight: string;
  age: string;
  phone: string;
  email: string;
  address: string;
  nationality: string;
  healthcareSupport: HealthcareSupport;
  medicalRecords: MedicalRecordSection[];
  notificationEnabled: boolean;
  selectedLanguage: string;
}

export interface ProfileOverviewForm {
  avatarUri: string;
  name: string;
  gender: string;
<<<<<<< HEAD:src/features/patient/types/profileOverview.types.ts
  dateOfBirth: string;
=======
>>>>>>> 290025c34b3930e6341a697d4a0c37e6f2562012:frontend/src/features/patient/types/profileOverview.types.ts
  height: string;
  weight: string;
  age: string;
  phone: string;
  email: string;
  address: string;
  nationality: string;
  selectedLanguage: string;
}
