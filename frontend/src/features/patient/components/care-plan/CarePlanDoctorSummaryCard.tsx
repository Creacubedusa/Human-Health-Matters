import { Image, Text, View } from 'react-native';
import type { CarePlan } from '../../types/carePlan.types';

interface CarePlanDoctorSummaryCardProps {
  carePlan: CarePlan;
  labels: {
    duration: string;
    sessionType: string;
    date: string;
  };
}

export function CarePlanDoctorSummaryCard({ carePlan, labels }: CarePlanDoctorSummaryCardProps) {
  return (
    <View className="bg-white border border-grey-300 rounded-lg px-4 py-3 w-full">
      <View className="gap-[30px]">
        <View className="flex-row items-start justify-between">
          <View className="flex-row items-start gap-4">
            <Image
              source={{ uri: carePlan.avatarUri }}
              className="w-10 h-10 rounded-full bg-grey-200"
            />
            <View className="gap-1">
              <Text className="text-s2 font-semibold font-sans text-[#414042]">
                {carePlan.doctorDisplayName}
              </Text>
              <Text className="text-c1 font-sans text-grey-600">{carePlan.specialty}</Text>
            </View>
          </View>

          <View className="bg-blue-50 rounded-lg px-4 py-1.5">
            <Text className="text-btn-tiny font-semibold font-sans text-blue-500">
              {carePlan.consultationType}
            </Text>
          </View>
        </View>

        <View className="flex-row items-center justify-between">
          <SummaryMetric label={labels.duration} value={carePlan.duration} align="left" />
          <SummaryMetric label={labels.sessionType} value={carePlan.sessionType} align="center" />
          <SummaryMetric label={labels.date} value={carePlan.detailDate} align="right" />
        </View>
      </View>
    </View>
  );
}

function SummaryMetric({
  label,
  value,
  align,
}: {
  label: string;
  value: string;
  align: 'left' | 'center' | 'right';
}) {
  const alignment = align === 'left' ? 'items-start' : align === 'center' ? 'items-center' : 'items-end';

  return (
    <View className={['w-20 gap-1', alignment].join(' ')}>
      <Text className="text-c1 font-sans text-grey-600">{label}</Text>
      <Text className="text-b4 font-sans text-grey-900">{value}</Text>
    </View>
  );
}
