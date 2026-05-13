import { ActivityIndicator, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { primitiveColors } from '@design/tokens';
import { StatusBanner } from './StatusBanner';

interface CoverageVerificationStepProps {
  currentStepIndex: 0 | 1 | 2;
  isComplete?: boolean;
}

const STEP_LABEL_KEYS = [
  'insuranceCoverage.verifying.steps.insuranceDetails',
  'insuranceCoverage.verifying.steps.fetchingBenefits',
  'insuranceCoverage.verifying.steps.checkingSupport',
] as const;

export function CoverageVerificationStep({ currentStepIndex, isComplete = false }: CoverageVerificationStepProps) {
  const { t } = useTranslation();

  return (
    <View className="gap-[50px]">
      <View className="items-center gap-8">
        {!isComplete && (
          <ActivityIndicator size="large" color={primitiveColors['primary-500']} />
        )}
        <Text className="text-s1 font-semibold font-sans text-center text-grey-900">
          {t(isComplete ? 'insuranceCoverage.verifying.completeTitle' : 'insuranceCoverage.verifying.title', {
            defaultValue: isComplete ? 'Verification Complete' : undefined,
          })}
        </Text>
      </View>

      <View className="gap-8 rounded-lg border-[0.8px] border-grey-300 bg-grey-100 p-4">
        {STEP_LABEL_KEYS.map((labelKey, index) => {
          const isCompleted = index < currentStepIndex;
          const isCurrent = index === currentStepIndex;

          return (
            <View key={labelKey} className="flex-row items-center gap-3">
              <View
                className={[
                  'h-4 w-4 rounded-full border',
                  isCompleted || isCurrent
                    ? 'border-primary-500 bg-primary-500'
                    : 'border-grey-300 bg-white',
                ].join(' ')}
              />
              <Text
                className={[
                  'text-b4 font-medium font-sans',
                  isCompleted || isCurrent ? 'text-grey-900' : 'text-grey-400',
                ].join(' ')}
              >
                {t(labelKey)}
              </Text>
            </View>
          );
        })}
      </View>

      <StatusBanner
        tone="info"
        title={t('insuranceCoverage.verifying.infoTitle')}
        description={t('insuranceCoverage.verifying.infoDescription')}
      />
    </View>
  );
}
