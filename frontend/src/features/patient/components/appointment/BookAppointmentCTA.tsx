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
      className="h-[72px] flex-row items-center rounded-2xl bg-primary-500 px-4"
      accessibilityRole="button"
    >
      <View className="h-10 w-10 items-center justify-center rounded-2xl bg-white">
        <Ionicons name="calendar-outline" size={22} color={primitiveColors['primary-500']} />
      </View>

      <Text className="ml-4 flex-1 text-[18px] font-semibold font-sans text-white">
        {t('appointmentManagement.bookAppointment')}
      </Text>

      <Ionicons name="chevron-forward" size={20} color={primitiveColors.white} />
    </Pressable>
  );
}
