import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { TagInput } from '@shared/components/ui/TagInput';
import type { ProfileForm } from '../types/profile.types';

interface Props {
  form: Pick<ProfileForm, 'surgeries'>;
  onChange: <K extends keyof ProfileForm>(field: K, value: ProfileForm[K]) => void;
  disabled?: boolean;
}

// Figma Screen 12: "Operation type" label + tag input with × removable tags
export function SurgeryStep({ form, onChange, disabled }: Props) {
  const { t } = useTranslation();

  return (
    <View className="w-full">
      <TagInput
        label={t('patientProfile.operationType')}
        values={form.surgeries}
        onChange={(v) => onChange('surgeries', v)}
        placeholder={t('patientProfile.surgeriesPlaceholder')}
        disabled={disabled}
        testID="surgeries-tag-input"
      />
    </View>
  );
}
