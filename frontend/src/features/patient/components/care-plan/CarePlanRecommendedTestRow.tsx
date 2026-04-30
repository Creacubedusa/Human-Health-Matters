import { Text, View } from 'react-native';
import type { RecommendedTest } from '../../types/carePlan.types';

interface CarePlanRecommendedTestRowProps {
  test: RecommendedTest;
}

export function CarePlanRecommendedTestRow({ test }: CarePlanRecommendedTestRowProps) {
  return (
    <View className="bg-primary-50 border border-primary-50 rounded-lg px-3 py-4 min-h-[54px] justify-center">
      <Text className="text-b3 font-sans text-grey-900">{test.name}</Text>
    </View>
  );
}
