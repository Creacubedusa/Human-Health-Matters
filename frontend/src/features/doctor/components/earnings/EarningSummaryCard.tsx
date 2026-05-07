import { Text, View } from 'react-native';

export interface EarningSummaryCardProps {
  value: string;
  title: string;
  subtitle: string;
  accentClassName: string;
}

export function EarningSummaryCard({
  value,
  title,
  subtitle,
  accentClassName,
}: EarningSummaryCardProps) {
  return (
    <View className="bg-white border border-grey-200 rounded-2xl p-4 w-[156px] h-[112px] justify-center">
      <View className="gap-2">
        <Text className={['text-h3 font-semibold font-sans', accentClassName].join(' ')}>
          {value}
        </Text>
        <Text className="text-c1 font-sans text-grey-900">{title}</Text>
        <Text className="text-c3 font-medium font-sans text-grey-500">{subtitle}</Text>
      </View>
    </View>
  );
}
