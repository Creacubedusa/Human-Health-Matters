import { ActivityIndicator, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { HeaderBackButton } from '@shared/components/ui/HeaderBackButton';
import { StepProgressBar } from '@shared/components/ui/StepProgressBar';
import { Button } from '@shared/components/ui/Button';
import { ProfileSetupStep } from '../types/doctorProfileSetup.types';
import { useDoctorProfileSetup } from '../hooks/useDoctorProfileSetup';
import { SetupIntroStep } from '../components/profile-setup/SetupIntroStep';
import { PersonalDetailsStep } from '../components/profile-setup/PersonalDetailsStep';
import { CredentialsStep } from '../components/profile-setup/CredentialsStep';
import { ServiceSetupStep } from '../components/profile-setup/ServiceSetupStep';
import { BankPracticeStep } from '../components/profile-setup/BankPracticeStep';
import { ReviewSubmitStep } from '../components/profile-setup/ReviewSubmitStep';
import { SubmissionSuccessModal } from '../components/profile-setup/SubmissionSuccessModal';

export interface DoctorProfileSetupWizardViewProps {
  onComplete?: () => void;
}

const STEP_BUTTON_LABEL: Record<ProfileSetupStep, string> = {
  [ProfileSetupStep.INTRO]: 'doctorProfileSetup.cta.continueSetup',
  [ProfileSetupStep.PERSONAL]: 'doctorProfileSetup.cta.next1',
  [ProfileSetupStep.CREDENTIALS]: 'doctorProfileSetup.cta.next2',
  [ProfileSetupStep.SERVICE]: 'doctorProfileSetup.cta.next3',
  [ProfileSetupStep.BANK]: 'doctorProfileSetup.cta.next4',
  [ProfileSetupStep.REVIEW]: 'doctorProfileSetup.cta.submit',
};

const HEADER_TITLE_KEY: Record<ProfileSetupStep, string> = {
  [ProfileSetupStep.INTRO]: 'doctorProfileSetup.header.title',
  [ProfileSetupStep.PERSONAL]: 'doctorProfileSetup.header.title',
  [ProfileSetupStep.CREDENTIALS]: 'doctorProfileSetup.header.title',
  [ProfileSetupStep.SERVICE]: 'doctorProfileSetup.header.title',
  [ProfileSetupStep.BANK]: 'doctorProfileSetup.header.title',
  [ProfileSetupStep.REVIEW]: 'doctorProfileSetup.header.reviewTitle',
};

const SHOW_PROGRESS = new Set([
  ProfileSetupStep.PERSONAL,
  ProfileSetupStep.CREDENTIALS,
  ProfileSetupStep.SERVICE,
  ProfileSetupStep.BANK,
]);

export function DoctorProfileSetupWizardView({ onComplete }: DoctorProfileSetupWizardViewProps) {
  const { t } = useTranslation();
  const {
    currentStep,
    form,
    consentChecked,
    isSubmitting,
    isSubmitted,
    submitError,
    progressPercent,
    canGoBack,
    isCurrentStepValid,
    goNext,
    goBack,
    handleSubmit,
    updatePersonalDetails,
    updateCredentials,
    updateDocuments,
    updateProfessionalDetails,
    updateBankInfo,
    updatePracticeInfo,
    setConsentChecked,
  } = useDoctorProfileSetup();

  function handleCtaPress() {
    if (currentStep === ProfileSetupStep.REVIEW) {
      void handleSubmit();
    } else {
      goNext();
    }
  }

  function renderStep() {
    switch (currentStep) {
      case ProfileSetupStep.INTRO:
        return <SetupIntroStep testID="step-intro" />;

      case ProfileSetupStep.PERSONAL:
        return (
          <PersonalDetailsStep
            data={form.personalDetails}
            onChange={updatePersonalDetails}
            testID="step-personal"
          />
        );

      case ProfileSetupStep.CREDENTIALS:
        return (
          <CredentialsStep
            credentials={form.credentials}
            documents={form.documents}
            onChangeCredentials={updateCredentials}
            onChangeDocuments={updateDocuments}
            testID="step-credentials"
          />
        );

      case ProfileSetupStep.SERVICE:
        return (
          <ServiceSetupStep
            data={form.professionalDetails}
            onChange={updateProfessionalDetails}
            testID="step-service"
          />
        );

      case ProfileSetupStep.BANK:
        return (
          <BankPracticeStep
            bankInfo={form.bankInfo}
            practiceInfo={form.practiceInfo}
            onChangeBankInfo={updateBankInfo}
            onChangePracticeInfo={updatePracticeInfo}
            testID="step-bank"
          />
        );

      case ProfileSetupStep.REVIEW:
        return (
          <ReviewSubmitStep
            form={form}
            consentChecked={consentChecked}
            onConsentChange={setConsentChecked}
            testID="step-review"
          />
        );

      default:
        return null;
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="bg-primary-50 px-4 pb-4 pt-2">
        <View className="flex-row items-center justify-between h-[29px]">
          <HeaderBackButton
            onPress={goBack}
            accessibilityLabel={t('common.back')}
            hidden={!canGoBack}
          />
          <Text className="text-s2 font-semibold font-sans text-grey-900 absolute left-0 right-0 text-center pointer-events-none">
            {t(HEADER_TITLE_KEY[currentStep])}
          </Text>
          <View className="w-[29px]" />
        </View>
      </View>

      {/* Progress bar */}
      {SHOW_PROGRESS.has(currentStep) && (
        <View className="px-4 pt-4 pb-2 bg-white">
          <StepProgressBar progress={progressPercent} showPercent />
        </View>
      )}

      {/* Error banner */}
      {submitError != null && (
        <View className="mx-4 mt-2 bg-red-50 border border-red-300 rounded-md p-3">
          <Text className="text-b3 font-sans text-red-600">{submitError}</Text>
        </View>
      )}

      {/* Step content */}
      <View className="flex-1">{renderStep()}</View>

      {/* CTA footer */}
      <View className="bg-white px-4 pt-4 pb-6 shadow-300">
        <Button
          label={
            isSubmitting
              ? t('common.loading')
              : t(STEP_BUTTON_LABEL[currentStep])
          }
          onPress={handleCtaPress}
          variant="filled"
          size="large"
          fullWidth
          disabled={!isCurrentStepValid || isSubmitting}
          iconLeft={
            isSubmitting ? <ActivityIndicator size="small" color="#ffffff" /> : undefined
          }
          testID="wizard-cta"
        />
      </View>

      {/* Success modal */}
      <SubmissionSuccessModal
        visible={isSubmitted}
        onGoToDashboard={onComplete ?? (() => {})}
        testID="submission-success-modal"
      />
    </SafeAreaView>
  );
}
