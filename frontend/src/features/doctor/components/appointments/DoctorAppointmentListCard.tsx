import { Image, Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { primitiveColors } from '@design/tokens';
import type { DoctorAppointmentStatus, DoctorManagedAppointment } from '../../types/doctorAppointments.types';

export interface DoctorAppointmentListCardProps {
  appointment: DoctorManagedAppointment;
  onPress?: (id: string) => void;
}

const STATUS_DOT: Record<DoctorAppointmentStatus, string> = {
  upcoming: 'bg-green-500',
  completed: 'bg-grey-400',
  cancelled: 'bg-red-400',
};

export function DoctorAppointmentListCard({ appointment, onPress }: DoctorAppointmentListCardProps) {
  const { t } = useTranslation();

  return (
    <Pressable
      onPress={() => onPress?.(appointment.id)}
      className="rounded-lg border border-grey-300 bg-white px-3 py-3"
      accessibilityRole="button"
    >
      <View className="flex-row items-end gap-4">
        <View className="relative h-20 w-20">
          <View className="h-20 w-20 items-center justify-center rounded-full border border-grey-200 bg-white">
            <Image
              source={{ uri: appointment.patientAvatar }}
              className="h-[62px] w-[62px] rounded-full bg-grey-100"
            />
          </View>
          <View className="absolute bottom-1 right-1">
            <View
              className={['h-3 w-3 rounded-full border-2 border-white', STATUS_DOT[appointment.status]].join(' ')}
            />
          </View>
        </View>

        <View className="flex-1 gap-2 pb-1">
          <View className="gap-1">
            <Text className="text-s2 font-semibold font-sans text-text-primary" numberOfLines={1}>
              {appointment.patientName}
            </Text>
            {!!appointment.specialty && (
              <Text className="text-b3 font-sans text-text-secondary">
                {appointment.specialty}
              </Text>
            )}
          </View>

          <View className="flex-row items-center gap-3">
            <Ionicons name="time-outline" size={18} color={primitiveColors['grey-900']} />
            <Text className="text-b2 font-medium font-sans text-text-primary">
              {appointment.date} {t('doctorAppointmentManagement.atLabel')} {appointment.time}
            </Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}
