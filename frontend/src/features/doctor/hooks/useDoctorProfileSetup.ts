import { useCallback } from 'react';
import { ProfileSetupStep } from '../types/doctorProfileSetup.types';
import { useDoctorProfileSetupStore } from '../store/doctorProfileSetup.store';

const STEP_PROGRESS: Record<ProfileSetupStep, number> = {
  [ProfileSetupStep.INTRO]: 0,
  [ProfileSetupStep.PERSONAL]: 0,
  [ProfileSetupStep.CREDENTIALS]: 40,
  [ProfileSetupStep.SERVICE]: 80,
  [ProfileSetupStep.BANK]: 100,
  [ProfileSetupStep.REVIEW]: 100,
};

const STEP_ORDER = [
  ProfileSetupStep.INTRO,
  ProfileSetupStep.PERSONAL,
  ProfileSetupStep.CREDENTIALS,
  ProfileSetupStep.SERVICE,
  ProfileSetupStep.BANK,
  ProfileSetupStep.REVIEW,
] as const;

export function useDoctorProfileSetup() {
  const store = useDoctorProfileSetupStore();

  const isStepValid = useCallback(
    (step: ProfileSetupStep): boolean => {
      const { form, consentChecked } = store;
      switch (step) {
        case ProfileSetupStep.INTRO:
          return true;
        case ProfileSetupStep.PERSONAL:
          return Boolean(form.personalDetails.gender && form.personalDetails.dateOfBirth);
        case ProfileSetupStep.CREDENTIALS:
          return Boolean(
            form.credentials.npiNumber &&
              form.credentials.stateMedicalLicense &&
              form.credentials.medicalSpecialty &&
              form.documents.medicalCertificate &&
              form.documents.boardCertificate &&
              form.documents.malpracticeInsurance,
          );
        case ProfileSetupStep.SERVICE:
          return Boolean(
            form.professionalDetails.yearsOfExperience &&
              form.professionalDetails.hospital &&
              form.professionalDetails.officeAddress &&
              form.professionalDetails.consultationFee &&
              form.professionalDetails.medicalSchool &&
              form.professionalDetails.biography,
          );
        case ProfileSetupStep.BANK:
          return Boolean(
            form.bankInfo.bankName &&
              form.bankInfo.accountName &&
              form.bankInfo.accountNumber &&
              form.bankInfo.sortCode &&
              form.practiceInfo.taxId &&
              form.practiceInfo.practiceName &&
              form.practiceInfo.billingAddress &&
              form.practiceInfo.zipCode &&
              form.practiceInfo.country,
          );
        case ProfileSetupStep.REVIEW:
          return consentChecked;
        default:
          return false;
      }
    },
    [store],
  );

  const currentIndex = STEP_ORDER.indexOf(store.currentStep);

  const goNext = useCallback(() => {
    if (currentIndex < STEP_ORDER.length - 1) {
      store.setStep(STEP_ORDER[currentIndex + 1]!);
    }
  }, [currentIndex, store]);

  const goBack = useCallback(() => {
    if (currentIndex > 0) {
      store.setStep(STEP_ORDER[currentIndex - 1]!);
    }
  }, [currentIndex, store]);

  const handleSubmit = useCallback(async () => {
    if (!isStepValid(ProfileSetupStep.REVIEW)) return;
    store.setSubmitting(true);
    store.setSubmitError(null);
    try {
      await new Promise<void>((resolve) => setTimeout(resolve, 1500));
      store.setSubmitted(true);
    } catch {
      store.setSubmitError('Submission failed. Please try again.');
    } finally {
      store.setSubmitting(false);
    }
  }, [isStepValid, store]);

  return {
    currentStep: store.currentStep,
    form: store.form,
    consentChecked: store.consentChecked,
    isSubmitting: store.isSubmitting,
    isSubmitted: store.isSubmitted,
    submitError: store.submitError,
    progressPercent: STEP_PROGRESS[store.currentStep],
    canGoBack: currentIndex > 0,
    isCurrentStepValid: isStepValid(store.currentStep),
    goNext,
    goBack,
    handleSubmit,
    updatePersonalDetails: store.updatePersonalDetails,
    updateCredentials: store.updateCredentials,
    updateDocuments: store.updateDocuments,
    updateProfessionalDetails: store.updateProfessionalDetails,
    updateBankInfo: store.updateBankInfo,
    updatePracticeInfo: store.updatePracticeInfo,
    setConsentChecked: store.setConsentChecked,
  };
}
