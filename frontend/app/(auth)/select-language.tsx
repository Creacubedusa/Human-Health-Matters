import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useSelectLanguage } from '@shared/hooks/useSelectLanguage';
import {
  SelectLanguageView,
  type LanguageOption,
} from '@shared/components/feedback/SelectLanguageView';

export default function SelectLanguageScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { selectedCode, setSelectedCode, handleSave } = useSelectLanguage();

  const options: LanguageOption[] = [
    { code: 'en', label: t('selectLanguage.english'), flagEmoji: '🇺🇸' },
    { code: 'es', label: t('selectLanguage.spanish'), flagEmoji: '🇪🇸' },
  ];

  async function onSave() {
    await handleSave();
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(auth)/select-role');
    }
  }

  function onBack() {
    if (router.canGoBack()) router.back();
  }

  return (
    <SelectLanguageView
      options={options}
      selectedCode={selectedCode}
      onSelectOption={setSelectedCode}
      onSave={onSave}
      onBack={onBack}
    />
  );
}
