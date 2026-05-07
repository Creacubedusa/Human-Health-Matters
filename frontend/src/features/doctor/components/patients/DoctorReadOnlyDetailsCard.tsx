import { Text, View } from 'react-native';

export interface DoctorReadOnlyDetailItem {
  label: string;
  value: string;
}

interface DoctorReadOnlyDetailsCardProps {
  title: string;
  items: DoctorReadOnlyDetailItem[];
}

export function DoctorReadOnlyDetailsCard({
  title,
  items,
}: DoctorReadOnlyDetailsCardProps) {
  return (
    <View className="bg-white border border-grey-200 rounded-2xl p-4 gap-4">
      <Text className="text-s2 font-semibold font-sans text-grey-900">{title}</Text>
      <View className="gap-4">
        {items.map((item) => (
          <View
            key={item.label}
            className="flex-row items-start justify-between gap-4 border-b border-grey-100 pb-3"
          >
            <Text className="text-b3 font-sans text-grey-500 flex-1">{item.label}</Text>
            <Text className="text-b3 font-sans text-grey-900 flex-1 text-right">{item.value}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}
