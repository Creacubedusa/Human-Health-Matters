import { Pressable, Text } from 'react-native';

export interface SuggestionChipProps {
  label: string;
  onPress: () => void;
}

export function SuggestionChip({ label, onPress }: SuggestionChipProps) {
  return (
    <Pressable
      onPress={onPress}
      className="w-full border border-grey-200 bg-white rounded-lg py-2.5 px-4"
      accessibilityRole="button"
    >
      <Text className="text-[14px] font-sans text-grey-700 text-center">{label}</Text>
    </Pressable>
  );
}
