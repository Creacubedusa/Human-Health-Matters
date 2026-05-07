import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { HeaderBackButton } from '@shared/components/ui/HeaderBackButton';
import { NotificationEmptyState } from '@shared/components/ui/NotificationEmptyState';

export interface DonorNotificationsViewProps {
  onBack: () => void;
}

export function DonorNotificationsView({ onBack }: DonorNotificationsViewProps) {
  const { t } = useTranslation();

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

      <NotificationEmptyState />
    </SafeAreaView>
  );
}
