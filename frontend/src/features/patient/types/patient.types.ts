export type FundingStatus = 'available' | 'unavailable' | 'checking';

// ── Legacy (kept for compatibility) ──────────────────────────────────────────

export interface Consultation {
  id: string;
  doctorName: string;
  date: string;
  status: 'pending' | 'active' | 'completed';
  diagnosis?: string;
}

export interface PatientDashboard {
  patientName: string;
  fundingStatus: FundingStatus;
  fundingBalance: number;
  recentConsultations: Consultation[];
}

// ── Login ─────────────────────────────────────────────────────────────────────

export type LoginMethod = 'email' | 'phone';

export interface LoginForm {
  email: string;
  phone: string;
  phoneCountryCode: string;
  password: string;
}

export type LoginErrors = Partial<Record<keyof LoginForm, string>>;

export interface ForgotPasswordForm {
  identifier: string; // email or phone
}

export interface SetPasswordForm {
  newPassword: string;
  confirmPassword: string;
}

export type SetPasswordErrors = Partial<Record<keyof SetPasswordForm, string>>;

// ── Sign-up ───────────────────────────────────────────────────────────────────

export interface SignUpForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  phoneCountryCode: string;
  password: string;
}

export type SignUpErrors = Partial<Record<keyof SignUpForm, string>>;

export interface PatientSignUpPayload {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  phoneCountryCode: string;
  password: string;
}

export interface PasswordStrength {
  minLength: boolean;
  hasNumber: boolean;
  hasSpecial: boolean;
  hasUpper: boolean;
  hasLower: boolean;
}

// ── Home Dashboard ────────────────────────────────────────────────────────────

export interface ConsultationActivity {
  type: 'consultation';
  id: string;
  title: string;
  subtitle: string;
  date: string;
  status: 'join' | 'upcoming' | 'completed';
  canJoin: boolean;
}

export interface SymptomActivity {
  type: 'symptomCheck';
  id: string;
  symptoms: string;
  date: string;
  severity: 'emergency' | 'low' | 'moderate';
}

export interface FundActivity {
  type: 'communityFund';
  id: string;
  description: string;
  date: string;
}

export type Activity = ConsultationActivity | SymptomActivity | FundActivity;

export interface CareInProgress {
  id: string;
  title: string;
  doctorName: string;
  specialty: string;
  date: string;
  isActive: boolean;
}

export interface CareFunding {
  totalCost: number;
  insurancePercent: number;
  donorPercent: number;
}

export interface PatientHomeDashboard {
  patientName: string;
  avatarUri?: string | null;
  isNewUser: boolean;
  careInProgress: CareInProgress | null;
  recentActivities: Activity[];
  careFunding: CareFunding | null;
}
