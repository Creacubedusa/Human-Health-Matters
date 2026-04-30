import { Pressable, Text, View } from 'react-native';

export type UserRole = 'patient' | 'doctor' | 'donor';

export interface RoleCardProps {
  role: UserRole;
  title: string;
  description: string;
  selected: boolean;
  onPress: () => void;
  testID?: string;
}

const CARD_CLASSES: Record<'selected' | 'unselected', string> = {
  selected:   'bg-white border border-primary-500 rounded-lg p-4 flex-row items-center gap-4',
  unselected: 'bg-white border border-grey-300 rounded-lg p-4 flex-row items-center gap-4',
};

export function RoleCard({
  role,
  title,
  description,
  selected,
  onPress,
  testID,
}: RoleCardProps) {
  return (
    <Pressable
      className={CARD_CLASSES[selected ? 'selected' : 'unselected']}
      onPress={onPress}
      accessibilityRole="radio"
      accessibilityLabel={title}
      accessibilityState={{ checked: selected }}
      testID={testID ?? `role-card-${role}`}
    >
      <View className="flex-1 gap-2">
        <Text className="text-b4 font-sans font-medium text-grey-900">{title}</Text>
        <Text className="text-c1 font-sans text-grey-500">{description}</Text>
      </View>
      <View className="w-6 h-6 rounded-full border-[1.5px] border-primary-500 items-center justify-center shrink-0">
        {selected && <View className="w-3 h-3 rounded-full bg-primary-500" />}
      </View>
    </Pressable>
  );
}
