import { ActivityIndicator, FlatList, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { primitiveColors } from '@design/tokens';
import { HeaderBackButton } from '@shared/components/ui/HeaderBackButton';
import { NotificationEmptyState } from '@shared/components/ui/NotificationEmptyState';
import { NotificationTabs } from '@features/patient/components/NotificationTabs';
import { useDoctorNotifications } from '../hooks/useDoctorNotifications';
import { DoctorNotificationItem } from '../components/notifications/DoctorNotificationItem';
import type { DoctorNotification } from '../types/doctorNotification.types';

export interface DoctorNotificationsViewProps {
  onBack: () => void;
  onJoinConsultation: (appointmentId: string) => void;
  onViewPatient: (patientId: string) => void;
  onReviewSummary: (patientId: string) => void;
  onCheckRecord: (patientId: string) => void;
}

export function DoctorNotificationsView({
  onBack,
  onJoinConsultation,
  onViewPatient,
  onReviewSummary,
  onCheckRecord,
}: DoctorNotificationsViewProps) {
  const { t } = useTranslation();
  const { status, hasNotifications, filteredNotifications, activeFilter, setFilter, handlePress, retry } =
    useDoctorNotifications();

  function handleAction(notification: DoctorNotification) {
    const meta = notification.metadata ?? {};

    if (notification.type === 'consultation' && meta.appointmentId) {
      onJoinConsultation(meta.appointmentId);
      return;
    }

    if (notification.type === 'patient_assigned' && meta.patientId) {
      onViewPatient(meta.patientId);
      return;
    }

    if (notification.type === 'ai_summary' && meta.patientId) {
      onReviewSummary(meta.patientId);
      return;
    }

    if (notification.type === 'test_result' && meta.patientId) {
      onCheckRecord(meta.patientId);
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      <View className="bg-primary-50 h-[66px] justify-end">
        <View className="h-[48px] flex-row items-center justify-between px-4 pb-3">
          <HeaderBackButton onPress={onBack} accessibilityLabel={t('common.back')} />

          <Text className="text-[16px] font-semibold font-sans text-grey-900">
            {t('notifications.headerTitle')}
          </Text>

          <View className="w-[29px]" />
        </View>
      </View>

      {status === 'loading' && (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={primitiveColors['primary-500']} />
        </View>
      )}

      {status === 'error' && (
        <View className="flex-1 items-center justify-center px-6 gap-4">
          <Text className="text-[15px] font-sans text-grey-700 text-center">
            {t('notifications.errorMessage')}
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
      )}

      {status === 'success' && (
        <View className="flex-1">
          {hasNotifications ? (
            <View className="pb-4 pt-6">
              <NotificationTabs activeFilter={activeFilter} onFilterChange={setFilter} />
            </View>
          ) : null}

          {filteredNotifications.length === 0 ? (
            <NotificationEmptyState />
          ) : (
            <FlatList
              className="flex-1"
              contentContainerClassName="px-4 pb-8"
              data={filteredNotifications}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => (
                <DoctorNotificationItem
                  notification={item}
                  onPress={handlePress}
                  onAction={() => handleAction(item)}
                />
              )}
            />
          )}
        </View>
      )}
    </SafeAreaView>
  );
}
