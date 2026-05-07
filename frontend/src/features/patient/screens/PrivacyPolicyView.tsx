import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { LegalDocumentSection } from '@shared/components/ui/LegalDocumentSection';
import { ProfileHeader } from '../components/profile/ProfileHeader';

export interface PrivacyPolicyViewProps {
  onBack: () => void;
}

interface PrivacyPolicySectionConfig {
  title: string;
  paragraphs?: string[];
  bullets?: string[];
}

export function PrivacyPolicyView({ onBack }: PrivacyPolicyViewProps) {
  const { t } = useTranslation();
  const sectionKeys: PrivacyPolicySectionConfig[] = [
    {
      title: 'profileOverview.privacyPolicySections.collect.title',
      paragraphs: ['profileOverview.privacyPolicySections.collect.body'],
      bullets: [
        'profileOverview.privacyPolicySections.collect.bullets.personalDetails',
        'profileOverview.privacyPolicySections.collect.bullets.healthInformation',
        'profileOverview.privacyPolicySections.collect.bullets.insuranceAndPayment',
        'profileOverview.privacyPolicySections.collect.bullets.aiInteractions',
        'profileOverview.privacyPolicySections.collect.bullets.appUsage',
      ],
    },
    {
      title: 'profileOverview.privacyPolicySections.use.title',
      paragraphs: ['profileOverview.privacyPolicySections.use.body'],
      bullets: [
        'profileOverview.privacyPolicySections.use.bullets.assessments',
        'profileOverview.privacyPolicySections.use.bullets.carePlans',
        'profileOverview.privacyPolicySections.use.bullets.insuranceVerification',
        'profileOverview.privacyPolicySections.use.bullets.fundingSupport',
        'profileOverview.privacyPolicySections.use.bullets.serviceImprovement',
      ],
    },
    {
      title: 'profileOverview.privacyPolicySections.share.title',
      paragraphs: ['profileOverview.privacyPolicySections.share.body'],
      bullets: [
        'profileOverview.privacyPolicySections.share.bullets.doctors',
        'profileOverview.privacyPolicySections.share.bullets.insuranceProviders',
        'profileOverview.privacyPolicySections.share.bullets.serviceProviders',
        'profileOverview.privacyPolicySections.share.bullets.legalRequirement',
      ],
    },
    {
      title: 'profileOverview.privacyPolicySections.security.title',
      bullets: [
        'profileOverview.privacyPolicySections.security.bullets.encrypted',
        'profileOverview.privacyPolicySections.security.bullets.authorizedAccess',
        'profileOverview.privacyPolicySections.security.bullets.control',
      ],
    },
    {
      title: 'profileOverview.privacyPolicySections.retention.title',
      paragraphs: ['profileOverview.privacyPolicySections.retention.body'],
    },
    {
      title: 'profileOverview.privacyPolicySections.contact.title',
      paragraphs: [
        'profileOverview.privacyPolicySections.contact.body',
        'profileOverview.privacyPolicySections.contact.email',
      ],
    },
    {
      title: 'profileOverview.privacyPolicySections.updates.title',
      paragraphs: ['profileOverview.privacyPolicySections.updates.body'],
    },
  ];

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      <ProfileHeader
        title={t('profileOverview.privacyPolicy')}
        backLabel={t('common.back')}
        onBack={onBack}
      />
      <ScrollView
        className="flex-1"
        contentContainerClassName="px-5 pt-7 pb-12"
        showsVerticalScrollIndicator={false}
      >
        <Text className="text-h5 font-semibold font-sans text-grey-900">
          {t('profileOverview.privacyPolicy')}
        </Text>

        <Text className="mt-4 text-[16px] font-sans text-grey-700 leading-6 tracking-[0.2px]">
          {t('profileOverview.privacyPolicyEffectiveDate')}
        </Text>

        <LegalDocumentSection
          paragraphs={[
            t('profileOverview.privacyPolicyIntro.effectiveDate'),
            t('profileOverview.privacyPolicyIntro.commitment'),
          ]}
        />

        <View className="h-4" />

        {sectionKeys.map((section) => (
          <LegalDocumentSection
            key={section.title}
            title={t(section.title)}
            paragraphs={section.paragraphs?.map((key) => t(key))}
            bullets={section.bullets?.map((key) => t(key))}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
