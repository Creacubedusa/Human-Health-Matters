import { Text, View } from 'react-native';
import { Button } from '@shared/components/ui/Button';
import type { CarePlan } from '../../types/carePlan.types';

interface CarePlanConsultationCardProps {
  carePlan: CarePlan;
  statusLabel: string;
  byDoctorLabel: string;
  buttonLabel: string;
  onViewCarePlan: (id: string) => void;
}

export function CarePlanConsultationCard({
  carePlan,
  statusLabel,
  byDoctorLabel,
  buttonLabel,
  onViewCarePlan,
}: CarePlanConsultationCardProps) {
  return (
    <View className="bg-primary-50 border border-primary-50 rounded-2xl px-4 py-6 w-full">
      <View className="gap-8">
        <View className="gap-4">
          <View className="flex-row items-center justify-between">
            <View className="bg-white rounded-lg px-4 py-1.5 min-w-[63px] items-center">
              <Text className="text-btn-tiny font-semibold font-sans text-green-500">
                {statusLabel}
              </Text>
            </View>
            <Text className="text-c1 font-sans text-grey-600">{carePlan.consultationDate}</Text>
          </View>

          <View className="gap-1">
            <Text className="text-s1 font-semibold font-sans text-grey-900">
              {carePlan.consultationTitle}
            </Text>
            <Text className="text-b4 font-sans text-grey-600">{byDoctorLabel}</Text>
          </View>
        </View>

        <Button
          label={buttonLabel}
          onPress={() => onViewCarePlan(carePlan.id)}
          variant="filled"
          size="medium"
          fullWidth
        />
      </View>
    </View>
  );
}
