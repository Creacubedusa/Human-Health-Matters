import { Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { primitiveColors } from '@design/tokens';

export interface BookAppointmentCTAProps {
  onPress: () => void;
}

export function BookAppointmentCTA({ onPress }: BookAppointmentCTAProps) {
  const { t } = useTranslation();

  return (
    <Pressable
      onPress={onPress}
      className="flex-row items-center bg-white border border-grey-100 rounded-2xl h-[72px] px-4"
      accessibilityRole="button"
    >
      {/* Calendar icon in circle */}
      <View className="w-10 h-10 rounded-full bg-grey-100 items-center justify-center">
        <Ionicons name="calendar-outline" size={22} color={primitiveColors['primary-500']} />
      </View>

      {/* Label */}
      <Text className="flex-1 ml-4 text-[16px] font-semibold font-sans text-grey-900">
        {t('appointmentManagement.bookAppointment')}
      </Text>

      {/* Chevron */}
      <Ionicons name="chevron-forward" size={20} color={primitiveColors['grey-400']} />
    </Pressable>
  );
}
