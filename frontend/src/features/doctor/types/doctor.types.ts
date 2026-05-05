export type OnboardingStatus = 'complete' | 'incomplete';

export interface DoctorRegisterPayload {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  phoneCountryCode: string;
  password: string;
}

export interface DoctorSignUpForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  phoneCountryCode: string;
  password: string;
}

export type DoctorSignUpErrors = Partial<Record<keyof DoctorSignUpForm, string>>;

export interface DoctorPasswordStrength {
  minLength: boolean;
  hasNumber: boolean;
  hasSpecial: boolean;
  hasUpper: boolean;
  hasLower: boolean;
}

export type DoctorLoginMethod = 'email' | 'phone';

export interface DoctorLoginForm {
  email: string;
  phone: string;
  phoneCountryCode: string;
  password: string;
}

export type DoctorLoginErrors = Partial<Record<keyof DoctorLoginForm, string>>;

export interface DoctorSetPasswordForm {
  newPassword: string;
  confirmPassword: string;
}

export type DoctorSetPasswordErrors = Partial<Record<keyof DoctorSetPasswordForm, string>>;

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

export type PatientUrgency = 'emergency' | 'moderate' | 'low';

export interface PatientInQueue {
  id: string;
  appointmentId?: string;
  name: string;
  gender: string;
  age: number;
  urgency: PatientUrgency;
  timeSlot: string;
  aiSummary: string;
  avatarUri?: string;
}

export interface DoctorStats {
  totalPatients: number;
  emergencyCount: number;
  seenCount: number;
}

export interface DoctorHomeDashboard {
  doctorName: string;
  isNewUser: boolean;
  stats: DoctorStats;
  patientsQueue: PatientInQueue[];
}

export type DoctorPatientSeverity = 'emergency' | 'moderate' | 'low';

export interface DoctorAIPrevisitSummary {
  label: string;
  summary: string;
}

export interface DoctorPrescriptionRecord {
  id: string;
  doctorName: string;
  specialty: string;
  licenseNo: string;
  date: string;
  status: 'active' | 'inactive';
  refillsLeft: number;
  totalRefills: number;
  medication: string;
  rxNumber: string;
  details: string[];
}

export interface DoctorOrderRecord {
  id: string;
  testName: string;
  orderedBy: string;
  date: string;
  status: 'ongoing' | 'completed';
  priority: 'urgent' | 'not-urgent';
}

export interface DoctorTestRecord {
  id: string;
  fileName: string;
  fileType: 'lab' | 'image';
  orderedBy: string;
  date: string;
}

export interface DoctorReportRecord {
  id: string;
  title: string;
  fileName: string;
  fileType: 'pdf' | 'image';
  uploadedBy: string;
  date: string;
}

export type FamilyDiabetesAnswer = 'yes' | 'no' | 'unknown' | '';

export interface DoctorPatientHistoryCategories {
  chronicDiseases: string[];
  familyDiabetesHistory: FamilyDiabetesAnswer;
  generalFamilyHistory: string[];
  surgeries: string[];
  allergies: string[];
}

export interface DoctorPatientMedicationCategories {
  medicationTypes: string[];
  currentMedications: string[];
}

export interface DoctorCarePlan {
  id: string;
  status: 'active' | 'inactive';
  title: string;
  doctorName: string;
  specialty: string;
  date: string;
}

export interface DoctorPatientMedicalRecords {
  patientHistory: string[];
  medication: string[];
  patientHistoryCategories: DoctorPatientHistoryCategories;
  medicationCategories: DoctorPatientMedicationCategories;
  orders: DoctorOrderRecord[];
  tests: DoctorTestRecord[];
  prescriptions: DoctorPrescriptionRecord[];
  reports: DoctorReportRecord[];
  carePlans: DoctorCarePlan[];
}

export interface DoctorPatientListItem {
  id: string;
  name: string;
  age: number;
  gender: string;
  appointmentTime: string;
  severity: DoctorPatientSeverity;
  aiSummary: DoctorAIPrevisitSummary;
  symptoms: string[];
  avatarUri?: string;
}

export interface DoctorPatientProfile extends DoctorPatientListItem {
  height: string;
  weight: string;
  phone: string;
  email: string;
  address: string;
  nationality: string;
  medicalRecords: DoctorPatientMedicalRecords;
}

export interface DoctorPrescriptionDraft {
  medication: string;
  brandName: string;
  dose: string;
  frequency: string;
  duration: string;
  route: string;
  refillsLeft: string;
  notes: string;
}

export interface DoctorOrderDraft {
  testName: string;
  priority: string;
  sampleType: string;
  collectionInstruction: string;
  additionalComment: string;
}

export interface DoctorReportDraft {
  title: string;
  category: string;
  fileUri: string | null;
}
