import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { Button } from '../ui/Button';
import { HeaderBackButton } from '../ui/HeaderBackButton';
import { LanguageOptionCard } from '../ui/LanguageOptionCard';

export interface LanguageOption {
  code: string;
  label: string;
  flagEmoji: string;
}

export interface SelectLanguageViewProps {
  options: LanguageOption[];
  selectedCode: string | null;
  onSelectOption: (code: string) => void;
  onSave: () => void;
  onBack: () => void;
}

export function SelectLanguageView({
  options,
  selectedCode,
  onSelectOption,
  onSave,
  onBack,
}: SelectLanguageViewProps) {
  const { t } = useTranslation();

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="bg-primary-50 flex-row items-center justify-center px-4 py-5 relative">
        <HeaderBackButton
          onPress={onBack}
          accessibilityLabel={t('common.back')}
          className="absolute left-4 border-grey-200"
        />
        <Text className="text-s2 font-sans font-semibold text-grey-900">
          {t('selectLanguage.headerTitle')}
        </Text>
      </View>

      {/* Content */}
      <View className="flex-1 px-[17px] pt-10">
        <Text className="text-h4 font-sans text-grey-900 text-center">
          {t('selectLanguage.title')}
        </Text>
        <View className="h-10" />
        <View className="gap-6">
          {options.map((opt) => (
            <LanguageOptionCard
              key={opt.code}
              languageCode={opt.code}
              label={opt.label}
              flagEmoji={opt.flagEmoji}
              selected={selectedCode === opt.code}
              onPress={() => onSelectOption(opt.code)}
            />
          ))}
        </View>
      </View>

      {/* Sticky bottom bar */}
      <View className="bg-white px-[17px] py-4">
        <Button
          label={t('selectLanguage.save')}
          variant="filled"
          size="large"
          fullWidth
          disabled={selectedCode === null}
          onPress={onSave}
          testID="select-language-save"
        />
      </View>
    </SafeAreaView>
  );
}
