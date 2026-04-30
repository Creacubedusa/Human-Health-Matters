import { ActivityIndicator, FlatList, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { primitiveColors } from '@design/tokens';
import { HeaderBackButton } from '@shared/components/ui/HeaderBackButton';
import { useNotifications } from '../hooks/useNotifications';
import { NotificationItem } from '../components/NotificationItem';
import { NotificationTabs } from '../components/NotificationTabs';
import { NotificationEmptyState } from '../components/NotificationEmptyState';
import type { Notification } from '../types/notification.types';

export interface NotificationViewProps {
  onBack: () => void;
  onJoinConsultation: (appointmentId: string) => void;
  onViewReport: (reportId: string) => void;
  onCheckOrder: (orderId: string) => void;
}

export function NotificationView({
  onBack,
  onJoinConsultation,
  onViewReport,
  onCheckOrder,
}: NotificationViewProps) {
  const { t } = useTranslation();
  const { status, filteredNotifications, activeFilter, setFilter, handlePress, retry } =
    useNotifications();

  function handleAction(notification: Notification) {
    const meta = notification.metadata ?? {};
    if (notification.type === 'doctor_joined' && meta.appointmentId) {
      onJoinConsultation(meta.appointmentId);
    } else if (notification.type === 'ai_report' && meta.reportId) {
      onViewReport(meta.reportId);
    } else if (notification.type === 'doctor_order' && meta.orderId) {
      onCheckOrder(meta.orderId);
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      {/* Header */}
      <View className="bg-primary-50 h-[66px] justify-end">
        <View className="h-[48px] flex-row items-center justify-between px-4 pb-3">
          <HeaderBackButton onPress={onBack} accessibilityLabel={t('common.back')} />

          <Text className="text-[16px] font-semibold font-sans text-grey-900">
            {t('notifications.headerTitle')}
          </Text>

          <View className="w-[29px]" />
        </View>
      </View>

      {/* Loading */}
      {status === 'loading' && (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={primitiveColors['primary-500']} />
        </View>
      )}

      {/* Error */}
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

      {/* Success */}
      {status === 'success' && (
        <View className="flex-1">
          {/* Filter tabs */}
          <View className="pt-6 pb-4">
            <NotificationTabs activeFilter={activeFilter} onFilterChange={setFilter} />
          </View>

          {/* Empty filtered state */}
          {filteredNotifications.length === 0 ? (
            <NotificationEmptyState />
          ) : (
            <FlatList
              className="flex-1"
              contentContainerClassName="pb-8"
              data={filteredNotifications}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => (
                <NotificationItem
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
