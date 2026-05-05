import { ScrollView, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { ReviewCard } from '@shared/components/ui/ReviewCard';
import { CheckboxGroup } from '@shared/components/ui/CheckboxGroup';
import type { DoctorProfileSetupForm } from '../../types/doctorProfileSetup.types';

export interface ReviewSubmitStepProps {
  form: DoctorProfileSetupForm;
  consentChecked: boolean;
  onConsentChange: (checked: boolean) => void;
  testID?: string;
}

export function ReviewSubmitStep({
  form,
  consentChecked,
  onConsentChange,
  testID,
}: ReviewSubmitStepProps) {
  const { t } = useTranslation();

  const credentialRows = [
    { label: t('doctorProfileSetup.review.npi'), value: form.credentials.npiNumber || '—' },
    { label: t('doctorProfileSetup.review.name'), value: '—' },
    { label: t('doctorProfileSetup.review.specialty'), value: form.credentials.medicalSpecialty || '—' },
    { label: t('doctorProfileSetup.review.license'), value: form.credentials.stateMedicalLicense || '—' },
  ];

  const practiceRows = [
    { label: t('doctorProfileSetup.review.practice'), value: form.practiceInfo.practiceName || '—' },
    { label: t('doctorProfileSetup.review.taxId'), value: form.practiceInfo.taxId || '—' },
    { label: t('doctorProfileSetup.review.billingAddress'), value: form.practiceInfo.billingAddress || '—' },
  ];

  const bankRows = [
    { label: t('doctorProfileSetup.review.bankName'), value: form.bankInfo.bankName || '—' },
    { label: t('doctorProfileSetup.review.accountName'), value: form.bankInfo.accountName || '—' },
    { label: t('doctorProfileSetup.review.accountNumber'), value: form.bankInfo.accountNumber || '—' },
  ];

  return (
    <ScrollView
      className="flex-1"
      contentContainerClassName="px-4 pt-6 pb-8 gap-6"
      showsVerticalScrollIndicator={false}
      testID={testID}
    >
      <View className="gap-1">
        <Text className="text-h4 font-semibold font-sans text-grey-900">
          {t('doctorProfileSetup.review.heading')}
        </Text>
        <Text className="text-b3 font-sans text-grey-500">
          {t('doctorProfileSetup.review.subtitle')}
        </Text>
      </View>

      <ReviewCard
        title={t('doctorProfileSetup.review.credentialsSection')}
        rows={credentialRows}
        testID="review-credentials"
      />

      <ReviewCard
        title={t('doctorProfileSetup.review.practiceSection')}
        rows={practiceRows}
        testID="review-practice"
      />

      <ReviewCard
        title={t('doctorProfileSetup.review.bankSection')}
        rows={bankRows}
        testID="review-bank"
      />

      <View className="bg-blue-50 border-[1.5px] border-blue-500 rounded-md p-4">
        <CheckboxGroup
          options={[{ label: t('doctorProfileSetup.review.consentText'), value: 'consent' }]}
          values={consentChecked ? ['consent'] : []}
          onChange={(vals) => onConsentChange(vals.includes('consent'))}
          testID="review-consent"
        />
      </View>
    </ScrollView>
  );
}
