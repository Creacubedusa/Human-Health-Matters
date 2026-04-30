import { Text, View } from 'react-native';

export interface PrescriptionDirectionsCardProps {
  title: string;
  body: string;
}

export function PrescriptionDirectionsCard({ title, body }: PrescriptionDirectionsCardProps) {
  return (
    <View className="bg-blue-50 rounded-sm px-4 py-4 gap-1">
      <Text className="text-s2 font-semibold font-sans text-grey-900">{title}</Text>
      <Text className="text-b4 font-medium font-sans text-grey-500 leading-relaxed">{body}</Text>
    </View>
  );
}
