import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { CheckboxGroup } from '@shared/components/ui/CheckboxGroup';
import type { ProfileForm } from '../types/profile.types';

interface Props {
  form: Pick<ProfileForm, 'chronicDiseases'>;
  onChange: <K extends keyof ProfileForm>(field: K, value: ProfileForm[K]) => void;
  disabled?: boolean;
}

// Figma Screen 9: Hypertension, Asthma, Heart disease, Others
export function ChronicDiseasesStep({ form, onChange, disabled }: Props) {
  const { t } = useTranslation();

  const options = [
    { label: t('patientProfile.chronicHypertension'),  value: 'hypertension'  },
    { label: t('patientProfile.chronicAsthma'),        value: 'asthma'        },
    { label: t('patientProfile.chronicHeartDisease'),  value: 'heart_disease' },
    { label: t('patientProfile.chronicOthers'),        value: 'others'        },
  ];

  return (
    <View className="gap-4">
      <CheckboxGroup
        options={options}
        values={form.chronicDiseases}
        onChange={(v) => onChange('chronicDiseases', v)}
        disabled={disabled}
        testID="chronic-diseases-checkbox"
      />
    </View>
  );
}
