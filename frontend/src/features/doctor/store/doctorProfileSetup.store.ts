import { create } from 'zustand';
import type {
  BankInfo,
  CredentialDetails,
  DocumentUploads,
  DoctorProfileSetupForm,
  PersonalDetails,
  PracticeInfo,
  ProfessionalDetails,
  StepValidationState,
} from '../types/doctorProfileSetup.types';
import { ProfileSetupStep } from '../types/doctorProfileSetup.types';

const MOCK_FORM: DoctorProfileSetupForm = {
  personalDetails: {
    profileImage: null,
    gender: '',
    dateOfBirth: '',
    availability: '',
  },
  credentials: {
    npiNumber: '',
    stateMedicalLicense: '',
    deaNumber: '',
    medicalSpecialty: '',
  },
  documents: {
    medicalCertificate: null,
    boardCertificate: null,
    deaRegistration: null,
    malpracticeInsurance: null,
  },
  professionalDetails: {
    yearsOfExperience: '',
    hospital: '',
    officeAddress: '',
    consultationFee: '',
    availability: '',
    medicalSchool: '',
    biography: '',
  },
  bankInfo: {
    bankName: '',
    accountName: '',
    accountNumber: '',
    sortCode: '',
    accountType: '',
  },
  practiceInfo: {
    taxId: '',
    practiceName: '',
    billingAddress: '',
    zipCode: '',
    country: '',
  },
};

const INITIAL_VALIDATION: StepValidationState = {
  [ProfileSetupStep.INTRO]: true,
  [ProfileSetupStep.PERSONAL]: false,
  [ProfileSetupStep.CREDENTIALS]: false,
  [ProfileSetupStep.SERVICE]: false,
  [ProfileSetupStep.BANK]: false,
  [ProfileSetupStep.REVIEW]: false,
};

interface DoctorProfileSetupState {
  currentStep: ProfileSetupStep;
  form: DoctorProfileSetupForm;
  validationState: StepValidationState;
  isSubmitting: boolean;
  isSubmitted: boolean;
  submitError: string | null;
  consentChecked: boolean;

  setStep: (step: ProfileSetupStep) => void;
  updatePersonalDetails: (data: Partial<PersonalDetails>) => void;
  updateCredentials: (data: Partial<CredentialDetails>) => void;
  updateDocuments: (data: Partial<DocumentUploads>) => void;
  updateProfessionalDetails: (data: Partial<ProfessionalDetails>) => void;
  updateBankInfo: (data: Partial<BankInfo>) => void;
  updatePracticeInfo: (data: Partial<PracticeInfo>) => void;
  setConsentChecked: (checked: boolean) => void;
  setSubmitting: (submitting: boolean) => void;
  setSubmitted: (submitted: boolean) => void;
  setSubmitError: (error: string | null) => void;
  resetForm: () => void;
}

export const useDoctorProfileSetupStore = create<DoctorProfileSetupState>((set) => ({
  currentStep: ProfileSetupStep.INTRO,
  form: MOCK_FORM,
  validationState: INITIAL_VALIDATION,
  isSubmitting: false,
  isSubmitted: false,
  submitError: null,
  consentChecked: false,

  setStep: (step) => set({ currentStep: step }),

  updatePersonalDetails: (data) =>
    set((s) => ({
      form: { ...s.form, personalDetails: { ...s.form.personalDetails, ...data } },
    })),

  updateCredentials: (data) =>
    set((s) => ({
      form: { ...s.form, credentials: { ...s.form.credentials, ...data } },
    })),

  updateDocuments: (data) =>
    set((s) => ({
      form: { ...s.form, documents: { ...s.form.documents, ...data } },
    })),

  updateProfessionalDetails: (data) =>
    set((s) => ({
      form: { ...s.form, professionalDetails: { ...s.form.professionalDetails, ...data } },
    })),

  updateBankInfo: (data) =>
    set((s) => ({
      form: { ...s.form, bankInfo: { ...s.form.bankInfo, ...data } },
    })),

  updatePracticeInfo: (data) =>
    set((s) => ({
      form: { ...s.form, practiceInfo: { ...s.form.practiceInfo, ...data } },
    })),

  setConsentChecked: (checked) => set({ consentChecked: checked }),
  setSubmitting: (isSubmitting) => set({ isSubmitting }),
  setSubmitted: (isSubmitted) => set({ isSubmitted }),
  setSubmitError: (submitError) => set({ submitError }),
  resetForm: () =>
    set({
      currentStep: ProfileSetupStep.INTRO,
      form: MOCK_FORM,
      validationState: INITIAL_VALIDATION,
      isSubmitting: false,
      isSubmitted: false,
      submitError: null,
      consentChecked: false,
    }),
}));
