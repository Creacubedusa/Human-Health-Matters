import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { HeaderBackButton } from '@shared/components/ui/HeaderBackButton';

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
            {t('donorHome.notifications')}
          </Text>

          <View className="w-[29px]" />
        </View>
      </View>

      <View className="flex-1 items-center justify-center px-6 gap-2">
        <Text className="text-h5 font-semibold font-sans text-grey-900 text-center">
          {t('notifications.emptyTitle')}
        </Text>
        <Text className="text-b2 font-sans text-grey-500 text-center">
          {t('notifications.emptySubtitle')}
        </Text>
      </View>
    </SafeAreaView>
  );
}
