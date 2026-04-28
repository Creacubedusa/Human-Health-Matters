import { useTranslation } from 'react-i18next';
import { Input } from '@shared/components/ui/Input';
import { SelectInput } from '@shared/components/ui/SelectInput';
import type {
  InsuredCoverageErrors,
  InsuredCoverageForm,
} from '@features/patient/types/insuranceCoverage.types';
import { InsuranceFormSection } from './InsuranceFormSection';

interface InsuredInsuranceInfoStepProps {
  form: InsuredCoverageForm;
  errors: InsuredCoverageErrors;
  onChange: <K extends keyof InsuredCoverageForm>(field: K, value: InsuredCoverageForm[K]) => void;
  onBlur: (field: keyof InsuredCoverageForm) => void;
}

export function InsuredInsuranceInfoStep({
  form,
  errors,
  onChange,
  onBlur,
}: InsuredInsuranceInfoStepProps) {
  const { t } = useTranslation();

  return (
    <InsuranceFormSection title={t('insuranceCoverage.insuranceInfo.title')}>
      <SelectInput
        label={t('insuranceCoverage.insuranceInfo.providerLabel')}
        placeholder={t('insuranceCoverage.insuranceInfo.providerLabel')}
        options={[{ label: 'United Healthcare', value: 'United Healthcare' }]}
        value={form.insuranceProvider || null}
        onChange={(value) => onChange('insuranceProvider', value)}
        helperText={t('insuranceCoverage.insuranceInfo.providerHelper')}
      />

      <Input
        label={t('insuranceCoverage.insuranceInfo.memberIdLabel')}
        placeholder={t('insuranceCoverage.insuranceInfo.memberIdPlaceholder')}
        value={form.memberId}
        onChangeText={(value) => onChange('memberId', value)}
        onBlur={() => onBlur('memberId')}
        status={errors.memberId ? 'error' : 'default'}
        helperText={errors.memberId ? t(errors.memberId) : undefined}
        autoCapitalize="characters"
      />

      <Input
        label={t('insuranceCoverage.insuranceInfo.groupNumberLabel')}
        placeholder={t('insuranceCoverage.insuranceInfo.groupNumberPlaceholder')}
        value={form.groupNumber}
        onChangeText={(value) => onChange('groupNumber', value)}
        onBlur={() => onBlur('groupNumber')}
        autoCapitalize="characters"
      />
    </InsuranceFormSection>
  );
}
