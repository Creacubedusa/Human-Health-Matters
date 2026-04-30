import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { ProfileHeader } from '../components/profile/ProfileHeader';

export interface PrivacyPolicyViewProps {
  onBack: () => void;
}

export function PrivacyPolicyView({ onBack }: PrivacyPolicyViewProps) {
  const { t } = useTranslation();

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      <ProfileHeader
        title={t('profileOverview.privacyPolicy')}
        backLabel={t('common.back')}
        onBack={onBack}
      />
      <ScrollView
        className="flex-1"
        contentContainerClassName="px-4 pt-6 pb-10"
        showsVerticalScrollIndicator={false}
      >
        <View className="bg-white border border-grey-200 rounded-2xl p-4 gap-4">
          <Text className="text-s2 font-semibold font-sans text-grey-900">
            {t('profileOverview.privacyIntroTitle')}
          </Text>
          <Text className="text-b3 font-sans text-grey-700">
            {t('profileOverview.privacyIntroBody')}
          </Text>
          <Text className="text-b3 font-sans text-grey-700">
            {t('profileOverview.privacyBody')}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
