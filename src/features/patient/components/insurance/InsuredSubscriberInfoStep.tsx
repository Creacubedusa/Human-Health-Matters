import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { primitiveColors } from '@design/tokens';
import { Input } from '@shared/components/ui/Input';
import { SelectInput } from '@shared/components/ui/SelectInput';
import type { InsuredCoverageForm } from '@features/patient/types/insuranceCoverage.types';
import { RELATIONSHIP_OPTIONS } from '@features/patient/types/insuranceCoverage.types';
import { InsuranceFormSection } from './InsuranceFormSection';

interface InsuredSubscriberInfoStepProps {
  form: InsuredCoverageForm;
  onChange: <K extends keyof InsuredCoverageForm>(field: K, value: InsuredCoverageForm[K]) => void;
}

export function InsuredSubscriberInfoStep({
  form,
  onChange,
}: InsuredSubscriberInfoStepProps) {
  const { t } = useTranslation();

  return (
    <InsuranceFormSection
      title={t('insuranceCoverage.subscriberInfo.title')}
      subtitle={t('insuranceCoverage.subscriberInfo.subtitle')}
    >
      <Input
        label={t('insuranceCoverage.subscriberInfo.firstNameLabel')}
        placeholder={t('insuranceCoverage.subscriberInfo.firstNamePlaceholder')}
        value={form.subscriberFirstName}
        onChangeText={(value) => onChange('subscriberFirstName', value)}
        autoCapitalize="words"
      />

      <Input
        label={t('insuranceCoverage.subscriberInfo.lastNameLabel')}
        placeholder={t('insuranceCoverage.subscriberInfo.lastNamePlaceholder')}
        value={form.subscriberLastName}
        onChangeText={(value) => onChange('subscriberLastName', value)}
        autoCapitalize="words"
      />

      <Input
        label={t('insuranceCoverage.subscriberInfo.dateOfBirthLabel')}
        placeholder={t('insuranceCoverage.subscriberInfo.dateOfBirthPlaceholder')}
        value={form.subscriberDateOfBirth}
        onChangeText={(value) => onChange('subscriberDateOfBirth', value)}
        keyboardType="numbers-and-punctuation"
        iconLeft={<Ionicons name="calendar-outline" size={24} color={primitiveColors['grey-900']} />}
      />

      <SelectInput
        label={t('insuranceCoverage.subscriberInfo.relationshipLabel')}
        placeholder={t('insuranceCoverage.subscriberInfo.relationshipPlaceholder')}
        options={RELATIONSHIP_OPTIONS.map((option) => ({ label: t(option.labelKey), value: option.value }))}
        value={form.relationshipToSubscriber || null}
        onChange={(value) => onChange('relationshipToSubscriber', value)}
      />
    </InsuranceFormSection>
  );
}
