import { Text, View } from 'react-native';
import type { Prescription } from '../../types/carePlan.types';

interface CarePlanPrescriptionItemProps {
  prescription: Prescription;
}

export function CarePlanPrescriptionItem({ prescription }: CarePlanPrescriptionItemProps) {
  return (
    <View className="gap-2">
      <Text className="text-b4 font-sans text-grey-900">{prescription.medication}</Text>
      <View className="gap-1">
        {prescription.details.map((detail) => (
          <View key={detail} className="flex-row gap-2 pr-1">
            <Text className="text-b3 font-sans text-grey-600">{'\u2022'}</Text>
            <Text className="flex-1 text-b3 font-sans text-grey-600">{detail}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}
