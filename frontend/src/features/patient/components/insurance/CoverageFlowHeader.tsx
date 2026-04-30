import { Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { HeaderBackButton } from '@shared/components/ui/HeaderBackButton';

interface CoverageFlowHeaderProps {
  titleKey: string;
  onBack: () => void;
}

export function CoverageFlowHeader({ titleKey, onBack }: CoverageFlowHeaderProps) {
  const { t } = useTranslation();

  return (
    <View className="h-[66px] bg-primary-50 justify-end">
      <View className="h-[48px] flex-row items-center justify-center px-4 pb-3">
        <HeaderBackButton
          onPress={onBack}
          accessibilityLabel={t('common.back')}
          className="absolute left-4 bottom-3"
        />

        <Text className="text-s2 font-semibold font-sans text-grey-900">
          {t(titleKey)}
        </Text>
      </View>
    </View>
  );
}
