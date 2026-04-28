import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { CheckboxGroup } from '@shared/components/ui/CheckboxGroup';
import type { ProfileForm } from '../types/profile.types';

interface Props {
  form: Pick<ProfileForm, 'generalFamilyHistory'>;
  onChange: <K extends keyof ProfileForm>(field: K, value: ProfileForm[K]) => void;
  disabled?: boolean;
}

// Figma Screen 10: Hypertension, Heart disease, Stroke, Cancer, Others
export function GeneralFamilyHistoryStep({ form, onChange, disabled }: Props) {
  const { t } = useTranslation();

  const options = [
    { label: t('patientProfile.familyHypertension'),  value: 'hypertension'  },
    { label: t('patientProfile.familyHeartDisease'),  value: 'heart_disease' },
    { label: t('patientProfile.familyStroke'),        value: 'stroke'        },
    { label: t('patientProfile.familyCancer'),        value: 'cancer'        },
    { label: t('patientProfile.familyOthers'),        value: 'others'        },
  ];

  return (
    <View className="gap-4">
      <CheckboxGroup
        options={options}
        values={form.generalFamilyHistory}
        onChange={(v) => onChange('generalFamilyHistory', v)}
        disabled={disabled}
        testID="general-family-history-checkbox"
      />
    </View>
  );
}
