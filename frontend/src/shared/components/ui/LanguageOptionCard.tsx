import { Pressable, Text } from 'react-native';

export interface LanguageOptionCardProps {
  languageCode: string;
  label: string;
  flagEmoji: string;
  selected: boolean;
  onPress: () => void;
  testID?: string;
}

const CARD_CLASSES: Record<'selected' | 'unselected', string> = {
  selected:   'bg-primary-50 border-2 border-primary-500 rounded-md p-3 flex-row items-center gap-3',
  unselected: 'bg-grey-50 border-2 border-grey-200 rounded-md p-3 flex-row items-center gap-3',
};

export function LanguageOptionCard({
  languageCode,
  label,
  flagEmoji,
  selected,
  onPress,
  testID,
}: LanguageOptionCardProps) {
  return (
    <Pressable
      className={CARD_CLASSES[selected ? 'selected' : 'unselected']}
      onPress={onPress}
      accessibilityRole="radio"
      accessibilityLabel={label}
      accessibilityState={{ checked: selected }}
      testID={testID ?? `language-card-${languageCode}`}
    >
      <Text className="text-2xl w-8 text-center">{flagEmoji}</Text>
      <Text className="text-b1 font-sans text-grey-900 flex-1">{label}</Text>
    </Pressable>
  );
}
