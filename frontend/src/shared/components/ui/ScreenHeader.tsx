import { Text, View } from 'react-native';
import { useRouter, type Href } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { goBackOrReplace } from '@shared/navigation/goBackOrReplace';
import { HeaderBackButton } from './HeaderBackButton';

export interface ScreenHeaderProps {
  title: string;
  fallbackHref?: Href;
  onBackPress?: () => void;
  hideBack?: boolean;
  rightSlot?: React.ReactNode;
  containerClassName?: string;
  rowClassName?: string;
  titleClassName?: string;
  rightSlotClassName?: string;
}

const DEFAULT_CONTAINER = 'bg-primary-50 px-4 pb-4 pt-2';
const DEFAULT_ROW = 'flex-row items-center justify-between h-[29px]';
const DEFAULT_TITLE = 'text-s2 font-semibold font-sans text-grey-900';

export function ScreenHeader({
  title,
  fallbackHref,
  onBackPress,
  hideBack = false,
  rightSlot,
  containerClassName,
  rowClassName,
  titleClassName,
  rightSlotClassName,
}: ScreenHeaderProps) {
  const router = useRouter();
  const { t } = useTranslation();

  const handleBack = () => {
    if (onBackPress) {
      onBackPress();
      return;
    }
    goBackOrReplace(router, fallbackHref ?? '/');
  };

  return (
    <View className={containerClassName ?? DEFAULT_CONTAINER}>
      <View className={rowClassName ?? DEFAULT_ROW}>
        <HeaderBackButton
          onPress={handleBack}
          accessibilityLabel={t('common.back')}
          hidden={hideBack}
        />
        <View
          pointerEvents="none"
          className="absolute left-0 right-0 top-0 bottom-0 items-center justify-center"
        >
          <Text className={titleClassName ?? DEFAULT_TITLE} numberOfLines={1}>
            {title}
          </Text>
        </View>
        <View className={rightSlotClassName ?? 'min-w-[29px] items-end'}>
          {rightSlot ?? <View className="w-[29px]" />}
        </View>
      </View>
    </View>
  );
}
