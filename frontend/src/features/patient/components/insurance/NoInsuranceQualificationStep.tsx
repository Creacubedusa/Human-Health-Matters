import { useTranslation } from 'react-i18next';
import { DatePickerField } from '@shared/components/ui/DatePickerField';
import { Input } from '@shared/components/ui/Input';
import { SelectInput } from '@shared/components/ui/SelectInput';
import { UploadInput } from '@shared/components/ui/UploadInput';
import type {
  NoInsuranceQualificationErrors,
  NoInsuranceQualificationForm,
} from '@features/patient/types/insuranceCoverage.types';
import {
  EMPLOYMENT_STATUS_OPTIONS,
} from '@features/patient/types/insuranceCoverage.types';
import { InsuranceFormSection } from './InsuranceFormSection';

interface NoInsuranceQualificationStepProps {
  form: NoInsuranceQualificationForm;
  errors: NoInsuranceQualificationErrors;
  onChange: <K extends keyof NoInsuranceQualificationForm>(
    field: K,
    value: NoInsuranceQualificationForm[K],
  ) => void;
  onBlur: (field: keyof NoInsuranceQualificationForm) => void;
}

export function NoInsuranceQualificationStep({
  form,
  errors,
  onChange,
  onBlur,
}: NoInsuranceQualificationStepProps) {
  const { t } = useTranslation();

  return (
    <InsuranceFormSection
      title={t('insuranceCoverage.noInsurance.title')}
      subtitle={t('insuranceCoverage.noInsurance.subtitle')}
    >
      <Input
        label={t('insuranceCoverage.noInsurance.fullNameLabel')}
        placeholder={t('insuranceCoverage.noInsurance.fullNamePlaceholder')}
        value={form.fullName}
        onChangeText={(value) => onChange('fullName', value)}
        onBlur={() => onBlur('fullName')}
        status={errors.fullName ? 'error' : 'default'}
        helperText={errors.fullName ? t(errors.fullName) : t('insuranceCoverage.noInsurance.fullNameHelper')}
        autoCapitalize="words"
      />

      <DatePickerField
        label={t('insuranceCoverage.noInsurance.dateOfBirthLabel')}
        placeholder={t('insuranceCoverage.noInsurance.dateOfBirthPlaceholder')}
        value={form.dateOfBirth}
        onChange={(value) => onChange('dateOfBirth', value)}
        onBlur={() => onBlur('dateOfBirth')}
        status={errors.dateOfBirth ? 'error' : 'default'}
        helperText={errors.dateOfBirth ? t(errors.dateOfBirth) : undefined}
        maximumDate={new Date()}
      />

      <SelectInput
        label={t('insuranceCoverage.noInsurance.employmentStatusLabel')}
        placeholder={t('insuranceCoverage.noInsurance.employmentStatusPlaceholder')}
        options={EMPLOYMENT_STATUS_OPTIONS.map((option) => ({ label: t(option.labelKey), value: option.value }))}
        value={form.employmentStatus || null}
        onChange={(value) => onChange('employmentStatus', value)}
        status={errors.employmentStatus ? 'error' : 'default'}
        helperText={errors.employmentStatus ? t(errors.employmentStatus) : undefined}
      />

      <Input
        label={t('insuranceCoverage.noInsurance.householdSizeLabel')}
        placeholder={t('insuranceCoverage.noInsurance.householdSizePlaceholder')}
        value={form.householdSize}
        onChangeText={(value) => onChange('householdSize', value)}
        onBlur={() => onBlur('householdSize')}
        status={errors.householdSize ? 'error' : 'default'}
        helperText={errors.householdSize ? t(errors.householdSize) : undefined}
        keyboardType="number-pad"
      />

      <Input
        label={t('insuranceCoverage.noInsurance.householdIncomeLabel')}
        placeholder={t('insuranceCoverage.noInsurance.householdIncomePlaceholder')}
        value={form.householdIncome}
        onChangeText={(value) => onChange('householdIncome', value)}
        onBlur={() => onBlur('householdIncome')}
        status={errors.householdIncome ? 'error' : 'default'}
        helperText={errors.householdIncome ? t(errors.householdIncome) : undefined}
        keyboardType="decimal-pad"
      />

      <UploadInput
        label={t('insuranceCoverage.noInsurance.proofOfIncomeLabel')}
        placeholder={t('insuranceCoverage.noInsurance.proofOfIncomePlaceholder')}
        value={form.proofOfIncomeUri}
        onChange={(uri) => onChange('proofOfIncomeUri', uri)}
        status={errors.proofOfIncomeUri ? 'error' : 'default'}
        helperText={errors.proofOfIncomeUri ? t(errors.proofOfIncomeUri) : undefined}
        loadingLabel={t('insuranceCoverage.noInsurance.uploading')}
        permissionTitle={t('insuranceCoverage.noInsurance.permissionTitle')}
        permissionDescription={t('insuranceCoverage.noInsurance.permissionDescription')}
      />
    </InsuranceFormSection>
  );
}
