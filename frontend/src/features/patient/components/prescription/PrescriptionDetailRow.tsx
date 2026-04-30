import { Text, View } from 'react-native';

export interface PrescriptionDetailRowProps {
  label: string;
  value: string;
}

export function PrescriptionDetailRow({ label, value }: PrescriptionDetailRowProps) {
  return (
    <View className="flex-row items-center justify-between gap-4 py-3">
      <Text className="text-b4 font-medium font-sans text-grey-500 shrink-0">{label}</Text>
      <Text className="text-s2 font-semibold font-sans text-grey-900 text-right flex-1">{value}</Text>
    </View>
  );
}
