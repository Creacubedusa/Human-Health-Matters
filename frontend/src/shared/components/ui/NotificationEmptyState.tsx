import { Image, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

const bellIllustration = require('../../../../assets/images/notification-empty-bell.png');

export function NotificationEmptyState() {
  const { t } = useTranslation();

  return (
    <View className="flex-1 items-center justify-center px-[30px] pb-24">
      <View className="w-full max-w-[334px] items-center gap-[35px]">
        <Image
          source={bellIllustration}
          className="h-[220px] w-[215px]"
          resizeMode="contain"
          accessibilityIgnoresInvertColors
        />

        <View className="w-full items-center gap-2">
          <Text className="w-full text-center text-[24px] leading-[28px] font-semibold font-sans text-grey-900">
            {t('notifications.emptyTitle')}
          </Text>
          <Text className="w-full text-center text-[16px] leading-[24px] font-sans text-grey-500">
            {t('notifications.emptySubtitle')}
          </Text>
        </View>
      </View>
    </View>
  );
}
