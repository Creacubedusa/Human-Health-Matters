import { Pressable, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import type { DoctorCarePlan } from '../../types/doctor.types';

export interface DoctorCarePlanCardProps {
  plan: DoctorCarePlan;
  onView: (id: string) => void;
}

export function DoctorCarePlanCard({ plan, onView }: DoctorCarePlanCardProps) {
  const { t } = useTranslation();
  const isActive = plan.status === 'active';

  return (
    <View className="bg-primary-50 border border-primary-50 rounded-2xl px-4 py-6 gap-8">
      <View className="gap-4">
        <View className="flex-row items-center justify-between">
          <View className="bg-white rounded-lg px-2 py-1.5">
            <Text
              className={[
                'text-[10px] font-semibold font-sans',
                isActive ? 'text-green-500' : 'text-grey-400',
              ].join(' ')}
            >
              {isActive
                ? t('doctorPatients.carePlanActive')
                : t('doctorPatients.carePlanInactive')}
            </Text>
          </View>
          <Text className="text-c1 font-sans text-grey-500">{plan.date}</Text>
        </View>

        <View className="gap-1">
          <Text className="text-[18px] font-semibold font-sans text-grey-900">{plan.title}</Text>
          <Text className="text-[14px] font-medium font-sans text-grey-500">
            {t('doctorPatients.carePlanBy', {
              name: plan.doctorName,
              specialty: plan.specialty,
            })}
          </Text>
        </View>
      </View>

      <Pressable
        className="bg-primary-500 h-10 rounded-xl items-center justify-center"
        onPress={() => onView(plan.id)}
        accessibilityRole="button"
      >
        <Text className="text-[14px] font-semibold font-sans text-white">
          {t('doctorPatients.viewCarePlan')}
        </Text>
      </Pressable>
    </View>
  );
}
