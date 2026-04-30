import { useTranslation } from 'react-i18next';
import { Pressable, Text, View } from 'react-native';
import { Button } from '@shared/components/ui/Button';
import type { CareInProgress } from '../types/patient.types';

interface Props {
  care: CareInProgress;
  onViewCarePlan: (id: string) => void;
}

// Figma: bg-primary-50, rounded-2xl, Active badge + date, title+doctor, View Care Plan button
export function CareInProgressCard({ care, onViewCarePlan }: Props) {
  const { t } = useTranslation();

  return (
    <View className="bg-primary-50 border border-primary-50 rounded-2xl px-4 py-6 w-full">
      <View className="gap-8">
        {/* Top section */}
        <View className="gap-4">
          {/* Active badge + date row */}
          <View className="flex-row items-center justify-between">
            <View className="bg-white rounded-lg px-2 py-1.5">
              <Text className="text-btn-tiny font-sans text-green-500">
                {t('patientHome.active')}
              </Text>
            </View>
            <Text className="text-c1 font-sans text-grey-600">{care.date}</Text>
          </View>

          {/* Title + doctor */}
          <View className="gap-1">
            <Text className="text-s1 font-semibold font-sans text-grey-900">
              {care.title}
            </Text>
            <Text className="text-b4 font-sans text-grey-600">
              {t('patientHome.byDoctor', { name: care.doctorName, specialty: care.specialty })}
            </Text>
          </View>
        </View>

        {/* View Care Plan button */}
        <Button
          label={t('patientHome.viewCarePlan')}
          onPress={() => onViewCarePlan(care.id)}
          variant="filled"
          size="medium"
          fullWidth
        />
      </View>
    </View>
  );
}
