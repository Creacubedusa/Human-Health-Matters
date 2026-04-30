import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';
import { RadioGroup } from '@shared/components/ui/RadioGroup';
import type { DiabetesStatus, ProfileForm } from '../types/profile.types';

interface Props {
  form: Pick<ProfileForm, 'diabetesStatus'>;
  errors: Partial<Record<keyof ProfileForm, string>>;
  onChange: <K extends keyof ProfileForm>(field: K, value: ProfileForm[K]) => void;
  disabled?: boolean;
}

// Figma Screen 6: 5 radio options
export function DiabetesStep({ form, errors, onChange, disabled }: Props) {
  const { t } = useTranslation();

  const options = [
    { label: t('patientProfile.diabetesType1'),     value: 'yes_type1'        },
    { label: t('patientProfile.diabetesType2'),     value: 'yes_type2'        },
    { label: t('patientProfile.diabetesGest'),      value: 'yes_gestational'  },
    { label: t('patientProfile.diabetesNo'),        value: 'no'               },
    { label: t('patientProfile.diabetesPreferNot'), value: 'prefer_not_to_say'},
  ];

  return (
    <View className="gap-4">
      <RadioGroup
        options={options}
        value={form.diabetesStatus}
        onChange={(v) => onChange('diabetesStatus', v as DiabetesStatus)}
        disabled={disabled}
        testID="diabetes-radio"
      />
      {errors.diabetesStatus != null && (
        <Text className="text-s2 font-sans text-red-500">{t(errors.diabetesStatus)}</Text>
      )}
    </View>
  );
}
