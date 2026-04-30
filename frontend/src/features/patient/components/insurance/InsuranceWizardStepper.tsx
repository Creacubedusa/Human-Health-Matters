import { Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

interface InsuranceWizardStepperProps {
  currentStep: 0 | 1 | 2;
}

const STEP_LABEL_KEYS = [
  'insuranceCoverage.stepper.patientInfo',
  'insuranceCoverage.stepper.insuranceInfo',
  'insuranceCoverage.stepper.subscriberInfo',
] as const;

export function InsuranceWizardStepper({ currentStep }: InsuranceWizardStepperProps) {
  const { t } = useTranslation();

  return (
    <View className="gap-3">
      <View className="flex-row items-center justify-between px-[18px]">
        {STEP_LABEL_KEYS.map((_, index) => {
          const isComplete = index < currentStep;
          const isCurrent = index === currentStep;

          return (
            <View key={index} className="flex-row items-center">
              <View
                className={[
                  'h-10 w-10 items-center justify-center rounded-full border',
                  isComplete || isCurrent
                    ? 'border-primary-500 bg-primary-500'
                    : 'border-grey-300 bg-white',
                ].join(' ')}
              >
                <Text
                  className={[
                    'text-b3 font-semibold font-sans',
                    isComplete || isCurrent ? 'text-white' : 'text-grey-400',
                  ].join(' ')}
                >
                  {index + 1}
                </Text>
              </View>

              {index < STEP_LABEL_KEYS.length - 1 && (
                <View
                  className={[
                    'h-[1px] w-[94px]',
                    index < currentStep ? 'bg-primary-500' : 'bg-grey-300',
                  ].join(' ')}
                />
              )}
            </View>
          );
        })}
      </View>

      <View className="flex-row justify-between">
        {STEP_LABEL_KEYS.map((labelKey, index) => (
          <Text
            key={labelKey}
            className={[
              'w-[108px] text-center text-[12px] leading-4 font-medium font-sans',
              index <= currentStep ? 'text-grey-900' : 'text-grey-400',
            ].join(' ')}
          >
            {t(labelKey)}
          </Text>
        ))}
      </View>
    </View>
  );
}
