import { useTranslation } from 'react-i18next';
import { Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function DoctorPatientsScreen() {
  const { t } = useTranslation();
  return (
    <SafeAreaView className="flex-1 bg-bg-default items-center justify-center">
      <Text className="text-s2 text-text-primary">{t('tabs.patients')}</Text>
    </SafeAreaView>
  );
}
