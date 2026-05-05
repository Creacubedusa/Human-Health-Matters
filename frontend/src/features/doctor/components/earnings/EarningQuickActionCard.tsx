import { Pressable, Text, View } from 'react-native';

export interface EarningQuickActionCardProps {
  icon: React.ReactNode;
  label: string;
  onPress: () => void;
}

export function EarningQuickActionCard({
  icon,
  label,
  onPress,
}: EarningQuickActionCardProps) {
  return (
    <Pressable
      onPress={onPress}
      className="items-center gap-2 w-[99px]"
      accessibilityRole="button"
    >
      <View className="size-8 rounded-2xl items-center justify-center">
        {icon}
      </View>
      <Text className="text-c1 font-medium font-sans text-grey-900 text-center">
        {label}
      </Text>
    </Pressable>
  );
}
