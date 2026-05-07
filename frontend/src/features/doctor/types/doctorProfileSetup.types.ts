export enum ProfileSetupStep {
  INTRO = 0,
  PERSONAL = 1,
  CREDENTIALS = 2,
  SERVICE = 3,
  BANK = 4,
  REVIEW = 5,
}

export interface PersonalDetails {
  profileImage: string | null;
  gender: string;
  dateOfBirth: string;
  availability: string;
}

export interface CredentialDetails {
  npiNumber: string;
  stateMedicalLicense: string;
  deaNumber: string;
  medicalSpecialty: string;
}

export interface DocumentUploads {
  medicalCertificate: string | null;
  boardCertificate: string | null;
  deaRegistration: string | null;
  malpracticeInsurance: string | null;
}

export interface ProfessionalDetails {
  yearsOfExperience: string;
  hospital: string;
  officeAddress: string;
  consultationFee: string;
  availability: string;
  medicalSchool: string;
  biography: string;
}

export interface BankInfo {
  bankName: string;
  accountName: string;
  accountNumber: string;
  sortCode: string;
  accountType: string;
}

export interface PracticeInfo {
  taxId: string;
  practiceName: string;
  billingAddress: string;
  zipCode: string;
  country: string;
}

export interface DoctorProfileSetupForm {
  personalDetails: PersonalDetails;
  credentials: CredentialDetails;
  documents: DocumentUploads;
  professionalDetails: ProfessionalDetails;
  bankInfo: BankInfo;
  practiceInfo: PracticeInfo;
}

export type StepValidationState = Record<ProfileSetupStep, boolean>;
