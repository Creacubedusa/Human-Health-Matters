import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';
import type { CareFunding } from '../types/patient.types';

interface Props {
  funding: CareFunding;
}

// Figma: bg-primary-50, rounded-2xl, h-[159px], total cost h3, 5-segment bar, legend
export function CareFundingCard({ funding }: Props) {
  const { t } = useTranslation();

  const insuranceSegments = Math.round((funding.insurancePercent / 100) * 5);
  const donorSegments     = 5 - insuranceSegments;

  return (
    <View className="bg-primary-50 rounded-2xl p-[21px] w-full">
      <View className="gap-4">
        {/* Title + total */}
        <View className="gap-4">
          <Text className="text-b4 font-sans text-grey-900">
            {t('patientHome.careFunding')}
          </Text>
          <View className="flex-row items-center justify-between">
            <Text className="text-b4 font-sans text-grey-600">
              {t('patientHome.totalCost')}
            </Text>
            <Text className="text-h3 font-semibold font-sans text-grey-900 text-right">
              ${funding.totalCost.toLocaleString()}.00
            </Text>
          </View>
        </View>

        {/* 5-segment bar */}
        <View className="gap-2">
          <View className="flex-row h-[13px] rounded-lg overflow-hidden">
            {[...Array(5)].map((_, i) => (
              <View
                key={i}
                className={['flex-1', i < insuranceSegments ? 'bg-primary-500' : 'bg-yellow-500'].join(' ')}
              />
            ))}
          </View>

          {/* Legend */}
          <View className="flex-row gap-12 items-center">
            <View className="flex-row items-center gap-2">
              <View className="w-4 h-4 rounded-full bg-primary-500" />
              <Text className="text-b4 font-sans text-grey-600">
                {t('patientHome.insurance', { percent: funding.insurancePercent })}
              </Text>
            </View>
            <View className="flex-row items-center gap-2">
              <View className="w-4 h-4 rounded-full bg-yellow-500" />
              <Text className="text-b4 font-sans text-grey-600">
                {t('patientHome.donor', { percent: funding.donorPercent })}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}
