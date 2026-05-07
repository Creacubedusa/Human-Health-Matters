import { Pressable, Text } from 'react-native';

export interface PatientHistoryCategoryCardProps {
  title: string;
  summary: string;
  onPress: () => void;
}

export function PatientHistoryCategoryCard({
  title,
  summary,
  onPress,
}: PatientHistoryCategoryCardProps) {
  return (
    <Pressable
      onPress={onPress}
      className="w-full bg-primary-50 px-4 py-4 gap-1"
      accessibilityRole="button"
    >
      <Text className="text-b2 font-medium font-sans text-grey-900">{title}</Text>
      <Text className="text-b3 font-sans text-grey-600">{summary}</Text>
    </Pressable>
  );
}
