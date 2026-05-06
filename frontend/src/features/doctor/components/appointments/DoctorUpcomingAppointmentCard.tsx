import { Image, Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { primitiveColors } from '@design/tokens';
import type { DoctorManagedAppointment } from '../../types/doctorAppointments.types';

export interface DoctorUpcomingAppointmentCardProps {
  appointment: DoctorManagedAppointment;
  onCancel: (id: string) => void;
  onReschedule: (id: string) => void;
  onJoin: (id: string) => void;
}

export function DoctorUpcomingAppointmentCard({
  appointment,
  onCancel,
  onReschedule,
  onJoin,
}: DoctorUpcomingAppointmentCardProps) {
  const { t } = useTranslation();
  const canJoin = appointment.status === 'upcoming';

  return (
    <View className="overflow-hidden rounded-2xl bg-primary-50">
      <View className="bg-primary-500 px-5 py-4">
        <View className="gap-2">
          <Text className="text-b3 font-sans text-white/60">
            {t('doctorAppointmentManagement.upcomingLabel')}
          </Text>
          <View className="flex-row items-center gap-3">
            <Ionicons name="time-outline" size={18} color={primitiveColors.white} />
            <Text className="text-b2 font-semibold font-sans text-white">
              {appointment.date} {t('doctorAppointmentManagement.atLabel')} {appointment.time}
            </Text>
          </View>
        </View>
      </View>

      <View className="gap-8 px-5 py-5">
        <View className="flex-row items-center gap-5">
          <View className="h-12 w-12 items-center justify-center rounded-full border border-[#41416e] bg-white">
            <Image
              source={{ uri: appointment.patientAvatar }}
              className="h-[46px] w-[46px] rounded-full bg-grey-100"
            />
          </View>
          <View className="gap-1">
            <Text className="text-s2 font-semibold font-sans text-text-primary">
              {appointment.patientName}
            </Text>
            {!!appointment.specialty && (
              <Text className="text-c1 font-sans text-text-secondary">
                {appointment.specialty}
              </Text>
            )}
          </View>
        </View>

        <View className="flex-row items-center justify-between gap-3">
          <View className="flex-1">
            <Pressable
              className={[
                'h-10 items-center justify-center rounded-xl border-[1.5px] border-primary-500 bg-white',
                !appointment.canCancel ? 'opacity-50' : '',
              ].join(' ')}
              onPress={!appointment.canCancel ? undefined : () => onCancel(appointment.id)}
              disabled={!appointment.canCancel}
              accessibilityRole="button"
            >
              <Text className="text-[14px] font-semibold font-sans text-primary-500">
                {t('doctorAppointmentManagement.cancelBtn')}
              </Text>
            </Pressable>
          </View>

          <View className="flex-1">
            <Pressable
              className={[
                'h-10 items-center justify-center rounded-xl bg-primary-500',
                !appointment.canReschedule ? 'opacity-50' : '',
              ].join(' ')}
              onPress={!appointment.canReschedule ? undefined : () => onReschedule(appointment.id)}
              disabled={!appointment.canReschedule}
              accessibilityRole="button"
            >
              <Text className="text-[14px] font-semibold font-sans text-white">
                {t('doctorAppointmentManagement.rescheduleBtn')}
              </Text>
            </Pressable>
          </View>
        </View>

        <Pressable
          className={[
            'h-11 items-center justify-center rounded-xl bg-green-600',
            !canJoin ? 'opacity-50' : '',
          ].join(' ')}
          onPress={!canJoin ? undefined : () => onJoin(appointment.id)}
          disabled={!canJoin}
          accessibilityRole="button"
        >
          <Text className="text-[14px] font-semibold font-sans text-white">
            {t('doctorAppointmentManagement.joinCallBtn')}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
