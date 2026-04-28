import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { CheckboxGroup } from '@shared/components/ui/CheckboxGroup';
import type { ProfileForm } from '../types/profile.types';

interface Props {
  form: Pick<ProfileForm, 'allergies'>;
  onChange: <K extends keyof ProfileForm>(field: K, value: ProfileForm[K]) => void;
  disabled?: boolean;
}

// Figma Screen 11: Food allergies, Medication allergies, Environmental allergies (pollen), Other allergies
export function AllergiesStep({ form, onChange, disabled }: Props) {
  const { t } = useTranslation();

  const options = [
    { label: t('patientProfile.allergyFood'),          value: 'food'          },
    { label: t('patientProfile.allergyMedication'),    value: 'medication'    },
    { label: t('patientProfile.allergyEnvironmental'), value: 'environmental' },
    { label: t('patientProfile.allergyOther'),         value: 'other'         },
  ];

  return (
    <View className="gap-4">
      <CheckboxGroup
        options={options}
        values={form.allergies}
        onChange={(v) => onChange('allergies', v)}
        disabled={disabled}
        testID="allergies-checkbox"
      />
    </View>
  );
}
