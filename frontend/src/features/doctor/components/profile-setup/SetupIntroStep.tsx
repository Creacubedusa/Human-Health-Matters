import { Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

export interface SetupIntroStepProps {
  testID?: string;
}

const CHECKLIST_ITEMS = [
  { key: 'personal', number: 1, titleKey: 'doctorProfileSetup.intro.personalTitle', subtitleKey: 'doctorProfileSetup.intro.personalSubtitle' },
  { key: 'credentials', number: 2, titleKey: 'doctorProfileSetup.intro.credentialsTitle', subtitleKey: 'doctorProfileSetup.intro.credentialsSubtitle' },
  { key: 'service', number: 3, titleKey: 'doctorProfileSetup.intro.serviceTitle', subtitleKey: 'doctorProfileSetup.intro.serviceSubtitle' },
  { key: 'payment', number: 4, titleKey: 'doctorProfileSetup.intro.paymentTitle', subtitleKey: 'doctorProfileSetup.intro.paymentSubtitle' },
] as const;

export function SetupIntroStep({ testID }: SetupIntroStepProps) {
  const { t } = useTranslation();

  return (
    <View className="flex-1 px-4 pt-10" testID={testID}>
      <View className="gap-2 mb-20">
        <Text className="text-h4 font-semibold font-sans text-grey-900 text-center">
          {t('doctorProfileSetup.intro.heading')}
        </Text>
        <Text className="text-b2 font-sans text-grey-500 text-center">
          {t('doctorProfileSetup.intro.subtitle')}
        </Text>
      </View>

      <View className="gap-4">
        {CHECKLIST_ITEMS.map((item) => (
          <View
            key={item.key}
            className="bg-white border border-grey-200 rounded-lg p-4 flex-row items-center justify-between"
          >
            <View className="gap-2 flex-1 mr-3">
              <Text className="text-s2 font-semibold font-sans text-grey-900">
                {t(item.titleKey)}
              </Text>
              <Text className="text-b3 font-sans text-grey-500">
                {t(item.subtitleKey)}
              </Text>
            </View>
            <View className="w-6 h-6 rounded-full bg-primary-500 items-center justify-center shrink-0">
              <Text className="text-c2 font-semibold font-sans text-white">{item.number}</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}
