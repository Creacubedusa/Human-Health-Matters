import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';
import { AvatarUpload } from '@shared/components/ui/AvatarUpload';
import { Input } from '@shared/components/ui/Input';
import { SelectInput } from '@shared/components/ui/SelectInput';
import type { ProfileForm } from '../types/profile.types';

const GENDER_OPTIONS = [
  { label: 'Male',   value: 'male'   },
  { label: 'Female', value: 'female' },
  { label: 'Other',  value: 'other'  },
];

interface Props {
  form: Pick<ProfileForm, 'avatarUri' | 'gender' | 'dateOfBirth' | 'nationality' | 'address'>;
  errors: Partial<Record<keyof ProfileForm, string>>;
  onChange: <K extends keyof ProfileForm>(field: K, value: ProfileForm[K]) => void;
  disabled?: boolean;
}

export function BasicInfoStep({ form, errors, onChange, disabled }: Props) {
  const { t } = useTranslation();

  return (
    <View className="gap-10 w-full">
      {/* Avatar — centred */}
      <View className="items-center">
        <AvatarUpload
          uri={form.avatarUri}
          onSelect={(uri) => onChange('avatarUri', uri)}
          disabled={disabled}
          testID="avatar-upload"
        />
      </View>

      {/* Form fields */}
      <View className="gap-4 w-full">
        {/* Gender dropdown */}
        <SelectInput
          label={t('patientProfile.genderLabel')}
          placeholder={t('patientProfile.genderLabel')}
          options={GENDER_OPTIONS}
          value={form.gender}
          onChange={(v) => onChange('gender', v as ProfileForm['gender'])}
          status={errors.gender ? 'error' : 'default'}
          helperText={errors.gender ? t(errors.gender) : undefined}
          disabled={disabled}
          testID="gender-select"
        />

        {/* Date of birth */}
        <Input
          label={t('patientProfile.dobLabel')}
          placeholder="DD/MM/YYYY"
          value={form.dateOfBirth ?? ''}
          onChangeText={(v) => onChange('dateOfBirth', v || null)}
          status={errors.dateOfBirth ? 'error' : 'default'}
          helperText={errors.dateOfBirth ? t(errors.dateOfBirth) : undefined}
          keyboardType="numbers-and-punctuation"
          disabled={disabled}
          testID="dob-input"
        />

        {/* Nationality — plain text */}
        <Input
          label={t('patientProfile.nationalityLabel')}
          placeholder={t('patientProfile.nationalityLabel')}
          value={form.nationality}
          onChangeText={(v) => onChange('nationality', v)}
          status={errors.nationality ? 'error' : 'default'}
          helperText={errors.nationality ? t(errors.nationality) : undefined}
          autoCapitalize="words"
          disabled={disabled}
          testID="nationality-input"
        />

        {/* Address */}
        <Input
          label={t('patientProfile.addressLabel')}
          placeholder={t('patientProfile.addressLabel')}
          value={form.address}
          onChangeText={(v) => onChange('address', v)}
          status={errors.address ? 'error' : 'default'}
          helperText={errors.address ? t(errors.address) : undefined}
          autoCapitalize="words"
          disabled={disabled}
          testID="address-input"
        />
      </View>
    </View>
  );
}
