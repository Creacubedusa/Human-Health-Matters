import { Text, View } from 'react-native';

export interface DoctorStatsRowProps {
  items: Array<{ label: string; value: string }>;
}

export function DoctorStatsRow({ items }: DoctorStatsRowProps) {
  return (
    <View className="flex-row gap-4">
      {items.map((item) => (
        <View
          key={item.label}
          className="h-[85px] w-[85px] rounded-md bg-grey-50 px-4 py-6 justify-center"
        >
          <Text className="text-b3 font-sans text-grey-500">
            {item.label}
          </Text>
          <Text className="mt-1.5 text-h5 font-semibold font-sans text-grey-900">
            {item.value}
          </Text>
        </View>
      ))}
    </View>
  );
}
