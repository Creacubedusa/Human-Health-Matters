import { Text, View } from 'react-native';
import type { Diagnosis } from '../../types/carePlan.types';

interface CarePlanDiagnosisRowProps {
  diagnosis: Diagnosis;
  primaryLabel: string;
  secondaryLabel: string;
  icdLabel: string;
}

export function CarePlanDiagnosisRow({
  diagnosis,
  primaryLabel,
  secondaryLabel,
  icdLabel,
}: CarePlanDiagnosisRowProps) {
  const isPrimary = diagnosis.priority === 'primary';

  return (
    <View className="bg-primary-50 border border-primary-50 rounded-lg px-3 py-2 min-h-[54px]">
      <View className="flex-row items-start justify-between gap-3">
        <View className="flex-1 gap-2">
          <Text className="text-b3 font-sans text-grey-600">{diagnosis.name}</Text>
          <Text className="text-c3 font-sans text-grey-900">
            {icdLabel}: {diagnosis.icd10Code}
          </Text>
        </View>

        <View className="bg-white rounded-lg px-4 py-1.5">
          <Text
            className={[
              'text-btn-tiny font-semibold font-sans',
              isPrimary ? 'text-primary-500' : 'text-blue-500',
            ].join(' ')}
          >
            {isPrimary ? primaryLabel : secondaryLabel}
          </Text>
        </View>
      </View>
    </View>
  );
}
