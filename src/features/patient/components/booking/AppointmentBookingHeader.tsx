import { Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { primitiveColors } from '@design/tokens';
import { HeaderBackButton } from '@shared/components/ui/HeaderBackButton';

export interface AppointmentBookingHeaderProps {
  title: string;
  onBack: () => void;
  showCalendarIcon?: boolean;
  rightIconName?: keyof typeof Ionicons.glyphMap;
  onRightPress?: () => void;
  rightAccessibilityLabel?: string;
}

export function AppointmentBookingHeader({
  title,
  onBack,
  showCalendarIcon = false,
  rightIconName,
  onRightPress,
  rightAccessibilityLabel,
}: AppointmentBookingHeaderProps) {
  return (
    <View
      className="bg-primary-50 flex-row items-center justify-center px-4"
      style={{ height: 66, minHeight: 66, maxHeight: 66 }}
    >
      <HeaderBackButton onPress={onBack} accessibilityLabel={title} className="absolute left-4" />

      <Text className="text-s2 font-semibold font-sans text-grey-900">
        {title}
      </Text>

      {rightIconName && onRightPress ? (
        <Pressable
          onPress={onRightPress}
          className="absolute right-5 h-6 w-6 items-center justify-center"
          accessibilityRole="button"
          accessibilityLabel={rightAccessibilityLabel ?? title}
        >
          <Ionicons name={rightIconName} size={24} color={primitiveColors['grey-900']} />
        </Pressable>
      ) : showCalendarIcon ? (
        <View className="absolute right-5 h-6 w-6 items-center justify-center">
          <Ionicons name="calendar-outline" size={24} color={primitiveColors['grey-900']} />
        </View>
      ) : null}
    </View>
  );
}
