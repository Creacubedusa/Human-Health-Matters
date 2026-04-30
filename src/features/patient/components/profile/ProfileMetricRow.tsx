import { Text, View } from 'react-native';
import type { ProfileMetric } from '../../types/profileOverview.types';

interface ProfileMetricRowProps {
  metrics: ProfileMetric[];
}

export function ProfileMetricRow({ metrics }: ProfileMetricRowProps) {
  return (
    <View className="flex-row items-center justify-center">
      {metrics.map((metric, index) => (
        <View
          key={metric.label}
          className={[
            'w-[76px] gap-1 items-center',
            index < metrics.length - 1 ? 'border-r border-grey-300' : '',
          ].join(' ')}
        >
          <Text className="text-c1 font-sans text-grey-600 text-center">{metric.label}</Text>
          <Text className="text-s2 font-semibold font-sans text-primary-500 text-center">
            {metric.value}
          </Text>
        </View>
      ))}
    </View>
  );
}
