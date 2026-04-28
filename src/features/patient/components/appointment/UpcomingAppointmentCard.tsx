import { Image, Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { primitiveColors } from '@design/tokens';
import { Button } from '@shared/components/ui/Button';
import type { PatientAppointment } from '../../types/appointmentManagement.types';

export interface UpcomingAppointmentCardProps {
  appointment: PatientAppointment;
  onCancel: (id: string) => void;
  onReschedule: (id: string) => void;
}

export function UpcomingAppointmentCard({
  appointment,
  onCancel,
  onReschedule,
}: UpcomingAppointmentCardProps) {
  const { t } = useTranslation();

  return (
    <View className="bg-white rounded-2xl border border-grey-100 px-4 py-5 gap-4">
      {/* Section label */}
      <View className="gap-1">
        <Text className="text-[14px] font-semibold font-sans text-grey-900">
          {t('appointmentManagement.upcomingLabel')}
        </Text>
        {/* Date/time badge */}
        <View className="flex-row items-center gap-1.5">
          <Ionicons name="calendar-outline" size={14} color={primitiveColors['primary-500']} />
          <Text className="text-[13px] font-sans text-primary-500">
            {appointment.date} {t('appointmentManagement.atLabel')} {appointment.time}
          </Text>
        </View>
      </View>

      {/* Doctor row */}
      <View className="flex-row items-center gap-4">
        <Image
          source={{ uri: appointment.doctorAvatar }}
          className="w-12 h-12 rounded-full bg-grey-100"
        />
        <View className="gap-0.5">
          <Text className="text-[16px] font-semibold font-sans text-grey-900">
            {appointment.doctorName}
          </Text>
          <Text className="text-[13px] font-sans text-grey-500">
            {appointment.specialty}
          </Text>
        </View>
      </View>

      {/* Action buttons */}
      <View className="flex-row gap-4">
        <Button
          label={t('appointmentManagement.cancelBtn')}
          variant="outline"
          size="small"
          onPress={() => onCancel(appointment.id)}
        />
        <Button
          label={t('appointmentManagement.rescheduleBtn')}
          variant="filled"
          size="small"
          onPress={() => onReschedule(appointment.id)}
        />
      </View>
    </View>
  );
}
