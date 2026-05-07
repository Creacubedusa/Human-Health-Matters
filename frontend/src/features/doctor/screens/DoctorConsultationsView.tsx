import { ActivityIndicator, FlatList, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { primitiveColors } from '@design/tokens';
import { useDoctorAppointmentManagement } from '@features/doctor/hooks/useDoctorAppointmentManagement';
import { DoctorUpcomingAppointmentCard } from '@features/doctor/components/appointments/DoctorUpcomingAppointmentCard';
import { DoctorAppointmentListCard } from '@features/doctor/components/appointments/DoctorAppointmentListCard';
import { DoctorAppointmentConfirmModal } from '@features/doctor/components/appointments/DoctorAppointmentConfirmModal';
import type { DoctorManagedAppointment } from '@features/doctor/types/doctorAppointments.types';

export interface DoctorConsultationsViewProps {
  onCalendar: () => void;
  onCancelConfirmed: () => void;
  onRescheduleConfirmed: () => void;
  onJoinAppointment: (id: string) => void;
}

export function DoctorConsultationsView({
  onCalendar,
  onCancelConfirmed,
  onRescheduleConfirmed,
  onJoinAppointment,
}: DoctorConsultationsViewProps) {
  const { t } = useTranslation();
  const {
    status,
    appointments,
    upcomingAppointment,
    cancelModalOpen,
    rescheduleModalOpen,
    openCancelModal,
    openRescheduleModal,
    closeModals,
    retry,
  } = useDoctorAppointmentManagement();

  const header = (
    <View className="bg-primary-50 h-[66px] justify-end">
      <View className="flex-row items-center justify-between px-5 pb-3 h-[48px]">
        <View className="w-[29px]" />

        <Text className="text-[16px] font-semibold font-sans text-grey-900">
          {t('doctorAppointmentManagement.headerTitle')}
        </Text>

        <Pressable
          onPress={onCalendar}
          className="w-[29px] h-[29px] items-end justify-center"
          accessibilityRole="button"
          accessibilityLabel={t('calendar.title', { defaultValue: 'Calendar' })}
        >
          <Ionicons name="calendar-outline" size={22} color={primitiveColors['grey-900']} />
        </Pressable>
      </View>
    </View>
  );

  if (status === 'loading') {
    return (
      <SafeAreaView className="flex-1 bg-white" edges={['top']}>
        {header}
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={primitiveColors['primary-500']} />
        </View>
      </SafeAreaView>
    );
  }

  if (status === 'error') {
    return (
      <SafeAreaView className="flex-1 bg-white" edges={['top']}>
        {header}
        <View className="flex-1 items-center justify-center px-6 gap-4">
          <Text className="text-[15px] font-sans text-grey-700 text-center">
            {t('doctorAppointmentManagement.errorMessage')}
          </Text>
          <Pressable
            onPress={retry}
            className="bg-primary-500 rounded-xl px-6 py-3"
            accessibilityRole="button"
          >
            <Text className="text-[14px] font-semibold font-sans text-white">{t('common.retry')}</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-grey-50" edges={['top']}>
      {header}

      <FlatList
        className="flex-1"
        contentContainerClassName="px-4 pt-4 pb-28 gap-4"
        showsVerticalScrollIndicator={false}
        data={appointments}
        keyExtractor={(item: DoctorManagedAppointment) => item.id}
        ListHeaderComponent={
          <View className="gap-4">
            {upcomingAppointment ? (
              <DoctorUpcomingAppointmentCard
                appointment={upcomingAppointment}
                onCancel={openCancelModal}
                onReschedule={openRescheduleModal}
                onJoin={onJoinAppointment}
              />
            ) : (
              <View className="bg-primary-50 rounded-2xl p-5 items-center">
                <Text className="text-[14px] font-sans text-grey-600 text-center">
                  {t('doctorAppointmentManagement.noUpcoming')}
                </Text>
              </View>
            )}

            {appointments.length > 0 && (
              <Text className="text-[16px] font-semibold font-sans text-grey-900">
                {t('doctorAppointmentManagement.listTitle')}
              </Text>
            )}
          </View>
        }
        ListEmptyComponent={
          <View className="items-center py-16 gap-3">
            <Ionicons name="calendar-outline" size={48} color={primitiveColors['grey-300']} />
            <Text className="text-[15px] font-sans text-grey-500 text-center">
              {t('doctorAppointmentManagement.emptyTitle')}
            </Text>
            <Text className="text-[13px] font-sans text-grey-400 text-center px-8">
              {t('doctorAppointmentManagement.emptySubtitle')}
            </Text>
          </View>
        }
        renderItem={({ item }: { item: DoctorManagedAppointment }) => (
          <DoctorAppointmentListCard appointment={item} />
        )}
      />

      <DoctorAppointmentConfirmModal
        visible={cancelModalOpen}
        type="cancel"
        onClose={closeModals}
        onConfirm={onCancelConfirmed}
      />

      <DoctorAppointmentConfirmModal
        visible={rescheduleModalOpen}
        type="reschedule"
        onClose={closeModals}
        onConfirm={onRescheduleConfirmed}
      />
    </SafeAreaView>
  );
}
