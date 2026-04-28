import { Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { primitiveColors } from '@design/tokens';

export function NotificationEmptyState() {
  const { t } = useTranslation();

  return (
    <View className="flex-1 items-center justify-center px-8 gap-6">
      <View className="w-[120px] h-[120px] rounded-full bg-primary-50 items-center justify-center">
        <Ionicons
          name="notifications-outline"
          size={56}
          color={primitiveColors['primary-200']}
        />
      </View>

      <View className="gap-2 items-center">
        <Text className="text-[18px] font-bold font-sans text-grey-900 text-center">
          {t('notifications.emptyTitle')}
        </Text>
        <Text className="text-[14px] font-sans text-grey-500 text-center leading-5">
          {t('notifications.emptySubtitle')}
        </Text>
      </View>
    </View>
  );
}
