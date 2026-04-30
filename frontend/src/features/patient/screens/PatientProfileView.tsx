import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { Alert } from '@shared/components/ui/Alert';
import { Button } from '@shared/components/ui/Button';
import { StepProgressBar } from '@shared/components/ui/StepProgressBar';
import { HeaderBackButton } from '@shared/components/ui/HeaderBackButton';
import { primitiveColors } from '@design/tokens';
import { usePatientProfile } from '../hooks/usePatientProfile';
import { BasicInfoStep } from '../components/BasicInfoStep';
import { WeightStep } from '../components/WeightStep';
import { HeightStep } from '../components/HeightStep';
import { DiabetesStep } from '../components/DiabetesStep';
import { DiabetesMedicationStep } from '../components/DiabetesMedicationStep';
import { FamilyHistoryDiabetesStep } from '../components/FamilyHistoryDiabetesStep';
import { ChronicDiseasesStep } from '../components/ChronicDiseasesStep';
import { GeneralFamilyHistoryStep } from '../components/GeneralFamilyHistoryStep';
import { AllergiesStep } from '../components/AllergiesStep';
import { SurgeryStep } from '../components/SurgeryStep';

export interface PatientProfileViewProps {
  onComplete: () => void;
}

// ── Step config ───────────────────────────────────────────────────────────────

const STEP_TITLE_KEY: Record<string, string> = {
  basicInfo:             'patientProfile.step1Title',
  weight:                'patientProfile.step2Title',
  height:                'patientProfile.step3Title',
  diabetes:              'patientProfile.step4Title',
  diabetesMedication:    'patientProfile.step5Title',
  familyHistoryDiabetes: 'patientProfile.step6Title',
  chronicDiseases:       'patientProfile.step7Title',
  generalFamilyHistory:  'patientProfile.step8Title',
  allergies:             'patientProfile.step9Title',
  surgery:               'patientProfile.step10Title',
};

const STEP_SUBTITLE_KEY: Record<string, string | undefined> = {
  weight:                'patientProfile.step2Subtitle',
  height:                'patientProfile.step3Subtitle',
  familyHistoryDiabetes: 'patientProfile.step6Subtitle',
  chronicDiseases:       'patientProfile.step7Subtitle',
  generalFamilyHistory:  'patientProfile.step8Subtitle',
  allergies:             'patientProfile.step9Subtitle',
  surgery:               'patientProfile.step10Subtitle',
};

// ── View ──────────────────────────────────────────────────────────────────────

export function PatientProfileView({ onComplete }: PatientProfileViewProps) {
  const { t } = useTranslation();
  const {
    form,
    currentStep,
    currentStepIndex,
    totalSteps,
    progress,
    skippable,
    isFirstStep,
    isLastStep,
    status,
    errors,
    handleChange,
    handleNext,
    handleSkip,
    handleBack,
  } = usePatientProfile();

  const isLoading = status === 'loading';
  const isError   = status === 'error';

  const titleKey    = STEP_TITLE_KEY[currentStep] ?? '';
  const subtitleKey = STEP_SUBTITLE_KEY[currentStep];

  // Title centred on weight/height/diabetes screens, left-aligned on rest
  const titleCentered = ['weight', 'height', 'diabetes'].includes(currentStep);

  function renderStep() {
    switch (currentStep) {
      case 'basicInfo':
        return <BasicInfoStep form={form} errors={errors} onChange={handleChange} disabled={isLoading} />;
      case 'weight':
        return <WeightStep form={form} errors={errors} onChange={handleChange} disabled={isLoading} />;
      case 'height':
        return <HeightStep form={form} errors={errors} onChange={handleChange} disabled={isLoading} />;
      case 'diabetes':
        return <DiabetesStep form={form} errors={errors} onChange={handleChange} disabled={isLoading} />;
      case 'diabetesMedication':
        return <DiabetesMedicationStep form={form} errors={errors} onChange={handleChange} disabled={isLoading} />;
      case 'familyHistoryDiabetes':
        return <FamilyHistoryDiabetesStep form={form} errors={errors} onChange={handleChange} disabled={isLoading} />;
      case 'chronicDiseases':
        return <ChronicDiseasesStep form={form} onChange={handleChange} disabled={isLoading} />;
      case 'generalFamilyHistory':
        return <GeneralFamilyHistoryStep form={form} onChange={handleChange} disabled={isLoading} />;
      case 'allergies':
        return <AllergiesStep form={form} onChange={handleChange} disabled={isLoading} />;
      case 'surgery':
        return <SurgeryStep form={form} onChange={handleChange} disabled={isLoading} />;
      default:
        return null;
    }
  }

  const nextLabel = isLastStep
    ? t('patientProfile.submit')
    : `${t('patientProfile.next')} ${currentStepIndex + 1}/${totalSteps}`;

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* ── Figma header: bg-primary-50, h-[120px] ── */}
      <View className="bg-primary-50 h-[66px] w-full justify-end">
        <View className="flex-row items-center justify-between px-4 pb-3 h-[48px]">
          {/* Back button — bordered square */}
          <HeaderBackButton
            onPress={handleBack}
            disabled={isFirstStep || isLoading}
            hidden={isFirstStep}
            accessibilityLabel={t('common.back')}
          />

          {/* Centered title */}
          <Text className="text-b2 font-semibold font-sans text-grey-900">
            {t('patientProfile.headerTitle')}
          </Text>

          {/* Right spacer — same width as back button */}
          <View className="w-[29px]" />
        </View>
      </View>

      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={120}
      >
        <ScrollView
          className="flex-1"
          contentContainerClassName="px-4 pt-8 pb-36"
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* ── Skip + progress bar row ── */}
          <View className="flex-row items-center justify-between mb-10">
            {skippable ? (
              <Pressable onPress={handleSkip} disabled={isLoading}>
                {({ pressed }) => (
                  <Text className={['text-b2 font-semibold font-sans text-grey-400', pressed ? 'opacity-50' : ''].join(' ')}>
                    {t('patientProfile.skip')}
                  </Text>
                )}
              </Pressable>
            ) : (
              <View className="w-[35px]" />
            )}
            <View className="flex-1 ml-4">
              <StepProgressBar progress={progress} showPercent />
            </View>
          </View>

          {/* ── Title + subtitle ── */}
          <View className="gap-2 mb-20">
            <Text className={['text-h4 font-semibold font-sans text-grey-900', titleCentered ? 'text-center' : ''].join(' ')}>
              {t(titleKey)}
            </Text>
            {subtitleKey != null && (
              <Text className={['text-b2 font-sans text-grey-600', titleCentered ? 'text-center' : ''].join(' ')}>
                {t(subtitleKey)}
              </Text>
            )}
          </View>

          {/* ── Step content ── */}
          {renderStep()}

          {/* ── Error ── */}
          {isError && (
            <View className="mt-6">
              <Alert status="error" description={t('patientProfile.errors.submitFailed')} />
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>

      {/* ── Sticky footer ── */}
      <View className="absolute bottom-0 left-0 right-0 bg-white h-[112px] items-center justify-start pt-8 px-4">
        <Button
          label={isLoading ? '' : nextLabel}
          onPress={() => handleNext(onComplete)}
          variant="filled"
          size="large"
          fullWidth
          disabled={isLoading}
          iconLeft={isLoading ? <ActivityIndicator size="small" color="#ffffff" /> : undefined}
        />
      </View>
    </SafeAreaView>
  );
}
