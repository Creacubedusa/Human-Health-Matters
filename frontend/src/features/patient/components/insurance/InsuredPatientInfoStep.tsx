import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { primitiveColors } from '@design/tokens';
import { DatePickerField } from '@shared/components/ui/DatePickerField';
import { Input } from '@shared/components/ui/Input';
import { SelectInput } from '@shared/components/ui/SelectInput';
import type {
  InsuredCoverageErrors,
  InsuredCoverageForm,
} from '@features/patient/types/insuranceCoverage.types';
import {
  GENDER_OPTIONS,
} from '@features/patient/types/insuranceCoverage.types';
import { InsuranceFormSection } from './InsuranceFormSection';

interface InsuredPatientInfoStepProps {
  form: InsuredCoverageForm;
  errors: InsuredCoverageErrors;
  onChange: <K extends keyof InsuredCoverageForm>(field: K, value: InsuredCoverageForm[K]) => void;
  onBlur: (field: keyof InsuredCoverageForm) => void;
}

export function InsuredPatientInfoStep({
  form,
  errors,
  onChange,
  onBlur,
}: InsuredPatientInfoStepProps) {
  const { t } = useTranslation();

  return (
    <InsuranceFormSection title={t('insuranceCoverage.patientInfo.title')}>
      <Input
        label={t('insuranceCoverage.patientInfo.firstNameLabel')}
        placeholder={t('insuranceCoverage.patientInfo.firstNamePlaceholder')}
        value={form.firstName}
        onChangeText={(value) => onChange('firstName', value)}
        onBlur={() => onBlur('firstName')}
        status={errors.firstName ? 'error' : 'default'}
        helperText={errors.firstName ? t(errors.firstName) : undefined}
        autoCapitalize="words"
      />

      <Input
        label={t('insuranceCoverage.patientInfo.lastNameLabel')}
        placeholder={t('insuranceCoverage.patientInfo.lastNamePlaceholder')}
        value={form.lastName}
        onChangeText={(value) => onChange('lastName', value)}
        onBlur={() => onBlur('lastName')}
        status={errors.lastName ? 'error' : 'default'}
        helperText={errors.lastName ? t(errors.lastName) : undefined}
        autoCapitalize="words"
      />

      <DatePickerField
        label={t('insuranceCoverage.patientInfo.dateOfBirthLabel')}
        placeholder={t('insuranceCoverage.patientInfo.dateOfBirthPlaceholder')}
        value={form.dateOfBirth}
        onChange={(value) => onChange('dateOfBirth', value)}
        onBlur={() => onBlur('dateOfBirth')}
        status={errors.dateOfBirth ? 'error' : 'default'}
        helperText={errors.dateOfBirth ? t(errors.dateOfBirth) : undefined}
        maximumDate={new Date()}
      />

      <SelectInput
        label={t('insuranceCoverage.patientInfo.genderLabel')}
        placeholder={t('insuranceCoverage.patientInfo.genderPlaceholder')}
        options={GENDER_OPTIONS.map((option) => ({ label: t(option.labelKey), value: option.value }))}
        value={form.gender || null}
        onChange={(value) => onChange('gender', value)}
        status={errors.gender ? 'error' : 'default'}
        helperText={errors.gender ? t(errors.gender) : undefined}
      />
    </InsuranceFormSection>
  );
}
