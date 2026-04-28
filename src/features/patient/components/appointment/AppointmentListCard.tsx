import { Image, Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { primitiveColors } from '@design/tokens';
import type { PatientAppointment, AppointmentStatus } from '../../types/appointmentManagement.types';

export interface AppointmentListCardProps {
  appointment: PatientAppointment;
  onPress?: (id: string) => void;
}

const STATUS_DOT: Record<AppointmentStatus, string> = {
  upcoming:  'bg-green-500',
  completed: 'bg-grey-400',
  cancelled: 'bg-red-400',
};

export function AppointmentListCard({ appointment, onPress }: AppointmentListCardProps) {
  const { t } = useTranslation();

  return (
    <Pressable
      onPress={() => onPress?.(appointment.id)}
      className="flex-row items-center px-4 py-4 gap-4 bg-white rounded-2xl border border-grey-100"
      accessibilityRole="button"
    >
      {/* Avatar */}
      <Image
        source={{ uri: appointment.doctorAvatar }}
        className="w-20 h-20 rounded-2xl bg-grey-100"
      />

      {/* Info */}
      <View className="flex-1 gap-1">
        <Text className="text-[15px] font-semibold font-sans text-grey-900" numberOfLines={1}>
          {appointment.doctorName}
        </Text>
        <Text className="text-[13px] font-sans text-grey-500">
          {appointment.specialty}
        </Text>
        {/* Date/time */}
        <View className="flex-row items-center gap-1 mt-1">
          <View className={['w-2 h-2 rounded-full', STATUS_DOT[appointment.status]].join(' ')} />
          <Text className="text-[12px] font-sans text-grey-500">
            {appointment.date} {t('appointmentManagement.atLabel')} {appointment.time}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}
