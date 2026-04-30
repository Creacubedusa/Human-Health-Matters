import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';
import { RadioGroup } from '@shared/components/ui/RadioGroup';
import type { ProfileForm } from '../types/profile.types';

interface Props {
  form: Pick<ProfileForm, 'familyHistoryDiabetes'>;
  errors: Partial<Record<keyof ProfileForm, string>>;
  onChange: <K extends keyof ProfileForm>(field: K, value: ProfileForm[K]) => void;
  disabled?: boolean;
}

// Figma Screen 8: Yes / No / Unknown
export function FamilyHistoryDiabetesStep({ form, errors, onChange, disabled }: Props) {
  const { t } = useTranslation();

  const options = [
    { label: t('patientProfile.yes'),     value: 'yes'     },
    { label: t('patientProfile.no'),      value: 'no'      },
    { label: t('patientProfile.unknown'), value: 'unknown' },
  ];

  return (
    <View className="gap-4">
      <RadioGroup
        options={options}
        value={form.familyHistoryDiabetes}
        onChange={(v) => onChange('familyHistoryDiabetes', v as ProfileForm['familyHistoryDiabetes'])}
        disabled={disabled}
        testID="family-history-diabetes-radio"
      />
      {errors.familyHistoryDiabetes != null && (
        <Text className="text-s2 font-sans text-red-500">{t(errors.familyHistoryDiabetes)}</Text>
      )}
    </View>
  );
}
