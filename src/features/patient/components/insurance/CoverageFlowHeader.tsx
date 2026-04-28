import { Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { primitiveColors } from '@design/tokens';

interface CoverageFlowHeaderProps {
  titleKey: string;
  onBack: () => void;
}

export function CoverageFlowHeader({ titleKey, onBack }: CoverageFlowHeaderProps) {
  const { t } = useTranslation();

  return (
    <View className="h-[120px] bg-primary-50 items-center justify-end pb-5">
      <Pressable
        onPress={onBack}
        className="absolute left-4 bottom-5 h-[29px] w-[29px] items-center justify-center rounded-md border border-grey-200"
        accessibilityRole="button"
        accessibilityLabel={t('common.back')}
      >
        <Ionicons name="chevron-back" size={20} color={primitiveColors['grey-900']} />
      </Pressable>

      <Text className="text-s2 font-semibold font-sans text-grey-900">
        {t(titleKey)}
      </Text>
    </View>
  );
}
