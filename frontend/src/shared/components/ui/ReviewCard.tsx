import { Text, View } from 'react-native';

export interface ReviewCardRow {
  label: string;
  value: string;
}

export interface ReviewCardProps {
  title: string;
  rows: ReviewCardRow[];
  testID?: string;
}

export function ReviewCard({ title, rows, testID }: ReviewCardProps) {
  return (
    <View className="bg-grey-50 rounded-2xl px-5 py-4 w-full gap-6" testID={testID}>
      <Text className="text-s1 font-semibold font-sans text-grey-900">{title}</Text>
      <View className="gap-4">
        {rows.map((row) => (
          <View key={row.label} className="flex-row items-start justify-between">
            <Text className="text-b4 font-sans text-grey-500 shrink-0 mr-4">{row.label}</Text>
            <Text className="text-s2 font-semibold font-sans text-grey-900 text-right flex-1" numberOfLines={2}>
              {row.value}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}
