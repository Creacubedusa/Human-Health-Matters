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

export interface PatientProfileOverview {
  isProfileComplete: boolean;
  avatarUri: string;
  name: string;
  gender: string;
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
  height: string;
  weight: string;
  age: string;
  phone: string;
  email: string;
  address: string;
  nationality: string;
  selectedLanguage: string;
}
