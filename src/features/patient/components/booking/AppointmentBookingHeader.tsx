import { Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { primitiveColors } from '@design/tokens';

export interface AppointmentBookingHeaderProps {
  title: string;
  onBack: () => void;
  showCalendarIcon?: boolean;
}

export function AppointmentBookingHeader({
  title,
  onBack,
  showCalendarIcon = false,
}: AppointmentBookingHeaderProps) {
  return (
    <View className="h-[120px] bg-primary-50 items-center justify-end pb-5">
      <Pressable
        onPress={onBack}
        className="absolute left-4 bottom-5 h-[29px] w-[29px] items-center justify-center rounded-md border border-grey-200"
        accessibilityRole="button"
        accessibilityLabel={title}
      >
        <Ionicons name="chevron-back" size={20} color={primitiveColors['grey-900']} />
      </Pressable>

      <Text className="text-s2 font-semibold font-sans text-grey-900">
        {title}
      </Text>

      {showCalendarIcon ? (
        <View className="absolute right-5 bottom-5 h-6 w-6 items-center justify-center">
          <Ionicons name="calendar-outline" size={24} color={primitiveColors['grey-900']} />
        </View>
      ) : null}
    </View>
  );
}
