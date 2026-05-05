import { ActivityIndicator, FlatList, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { primitiveColors } from '@design/tokens';
import { HeaderBackButton } from '@shared/components/ui/HeaderBackButton';
import { useAppointmentManagement } from '../hooks/useAppointmentManagement';
import { UpcomingAppointmentCard } from '../components/appointment/UpcomingAppointmentCard';
import { AppointmentListCard } from '../components/appointment/AppointmentListCard';
import { BookAppointmentCTA } from '../components/appointment/BookAppointmentCTA';
import { AppointmentConfirmModal } from '../components/appointment/AppointmentConfirmModal';
import type { PatientAppointment } from '../types/appointmentManagement.types';

export interface AppointmentHomeViewProps {
  onBookAppointment: () => void;
  onCancelConfirmed: () => void;
  onRescheduleConfirmed: () => void;
  onJoinAppointment: (id: string) => void;
  onBack?: () => void;
  onCalendar?: () => void;
}

export function AppointmentHomeView({
  onBookAppointment,
  onCancelConfirmed,
  onRescheduleConfirmed,
  onJoinAppointment,
  onBack,
  onCalendar,
}: AppointmentHomeViewProps) {
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
  } = useAppointmentManagement();

  const header = (
    <View className="bg-primary-50 h-[66px] justify-end">
      <View className="flex-row items-center justify-between px-5 pb-3 h-[48px]">
        <HeaderBackButton
          onPress={onBack}
          disabled={!onBack}
          accessibilityLabel={t('common.back')}
        />

        <Text className="text-[16px] font-semibold font-sans text-grey-900">
          {t('appointmentManagement.headerTitle')}
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

  // ── Loading ───────────────────────────────────────────────────────────────
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

  // ── Error ─────────────────────────────────────────────────────────────────
  if (status === 'error') {
    return (
      <SafeAreaView className="flex-1 bg-white" edges={['top']}>
        {header}
        <View className="flex-1 items-center justify-center px-6 gap-4">
          <Text className="text-[15px] font-sans text-grey-700 text-center">
            {t('appointmentManagement.errorMessage')}
          </Text>
          <Pressable
            onPress={retry}
            className="bg-primary-500 rounded-xl px-6 py-3"
            accessibilityRole="button"
          >
            <Text className="text-[14px] font-semibold font-sans text-white">
              {t('common.retry')}
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-grey-50" edges={['top']}>
      {/* Header */}
      {header}

      {/* Content */}
      <FlatList
        className="flex-1"
        contentContainerClassName="px-4 pt-4 pb-28 gap-4"
        showsVerticalScrollIndicator={false}
        data={appointments}
        keyExtractor={(item: PatientAppointment) => item.id}
        ListHeaderComponent={
          <View className="gap-4">
            {/* Upcoming appointment card */}
            {upcomingAppointment ? (
              <UpcomingAppointmentCard
                appointment={upcomingAppointment}
                onCancel={openCancelModal}
                onReschedule={openRescheduleModal}
                onJoin={onJoinAppointment}
              />
            ) : (
              <View className="bg-primary-50 rounded-2xl p-5 items-center">
                <Text className="text-[14px] font-sans text-grey-600 text-center">
                  {t('appointmentManagement.noUpcoming')}
                </Text>
              </View>
            )}

            {/* Book appointment CTA */}
            <BookAppointmentCTA onPress={onBookAppointment} />

            {/* List title */}
            {appointments.length > 0 && (
              <Text className="text-[16px] font-semibold font-sans text-grey-900">
                {t('appointmentManagement.listTitle')}
              </Text>
            )}
          </View>
        }
        ListEmptyComponent={
          <View className="items-center py-16 gap-3">
            <Ionicons name="calendar-outline" size={48} color={primitiveColors['grey-300']} />
            <Text className="text-[15px] font-sans text-grey-500 text-center">
              {t('appointmentManagement.emptyTitle')}
            </Text>
            <Text className="text-[13px] font-sans text-grey-400 text-center px-8">
              {t('appointmentManagement.emptySubtitle')}
            </Text>
          </View>
        }
        renderItem={({ item }: { item: PatientAppointment }) => (
          <AppointmentListCard appointment={item} />
        )}
      />

      {/* Cancel confirmation modal */}
      <AppointmentConfirmModal
        visible={cancelModalOpen}
        type="cancel"
        onClose={closeModals}
        onConfirm={onCancelConfirmed}
      />

      {/* Reschedule confirmation modal */}
      <AppointmentConfirmModal
        visible={rescheduleModalOpen}
        type="reschedule"
        onClose={closeModals}
        onConfirm={onRescheduleConfirmed}
      />
    </SafeAreaView>
  );
}
