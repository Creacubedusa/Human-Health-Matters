import { Ionicons } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';
import { primitiveColors } from '@design/tokens';

interface ProfileActionRowProps {
  title: string;
  subtitle?: string;
  iconLeft?: React.ReactNode;
  rightElement?: React.ReactNode;
  onPress?: () => void;
}

export function ProfileActionRow({
  title,
  subtitle,
  iconLeft,
  rightElement,
  onPress,
}: ProfileActionRowProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      className="min-h-[35px] flex-row items-center justify-between px-2 py-2"
      accessibilityRole={onPress ? 'button' : undefined}
    >
      <View className="flex-row items-center gap-4 flex-1 pr-3">
        {iconLeft != null && (
          <View className="w-4 h-4 items-center justify-center">{iconLeft}</View>
        )}
        <View className="gap-1 flex-1">
          <Text className="text-b3 font-sans text-grey-900">{title}</Text>
          {subtitle != null && (
            <Text className="text-c1 font-sans text-grey-600" numberOfLines={2}>
              {subtitle}
            </Text>
          )}
        </View>
      </View>

      {rightElement ?? (
        <Ionicons name="chevron-forward" size={18} color={primitiveColors['grey-900']} />
      )}
    </Pressable>
  );
}
