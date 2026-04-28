import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';
import { StepperInput } from '@shared/components/ui/StepperInput';
import { UnitToggle } from '@shared/components/ui/UnitToggle';
import type { HeightUnit, ProfileForm } from '../types/profile.types';

interface Props {
  form: Pick<ProfileForm, 'heightCm' | 'heightFeet' | 'heightInches' | 'heightUnit'>;
  errors: Partial<Record<keyof ProfileForm, string>>;
  onChange: <K extends keyof ProfileForm>(field: K, value: ProfileForm[K]) => void;
  disabled?: boolean;
}

export function HeightStep({ form, errors, onChange, disabled }: Props) {
  const { t } = useTranslation();

  const heightError = errors.heightCm ?? errors.heightFeet;

  function handleUnitChange(unit: string) {
    const u: HeightUnit = unit === 'ft/in' ? 'ft_in' : 'cm';
    onChange('heightUnit', u);
    onChange('heightCm', 0);
    onChange('heightFeet', 0);
    onChange('heightInches', 0);
  }

  return (
    <View className="items-center gap-12 w-full">
      {/* Steppers — 320px wide as per Figma */}
      <View className="w-[320px] gap-2">
        {form.heightUnit === 'cm' ? (
          <StepperInput
            value={form.heightCm}
            onIncrement={() => onChange('heightCm', Math.min(300, form.heightCm + 1))}
            onDecrement={() => onChange('heightCm', Math.max(0, form.heightCm - 1))}
            label={t('patientProfile.unitCm')}
            min={0}
            max={300}
            disabled={disabled}
            testID="height-cm-stepper"
          />
        ) : (
          <>
            <StepperInput
              value={form.heightFeet}
              onIncrement={() => onChange('heightFeet', Math.min(9, form.heightFeet + 1))}
              onDecrement={() => onChange('heightFeet', Math.max(0, form.heightFeet - 1))}
              label={t('patientProfile.unitFeet')}
              min={0}
              max={9}
              disabled={disabled}
              testID="height-feet-stepper"
            />
            <StepperInput
              value={form.heightInches}
              onIncrement={() => onChange('heightInches', Math.min(11, form.heightInches + 1))}
              onDecrement={() => onChange('heightInches', Math.max(0, form.heightInches - 1))}
              label={t('patientProfile.unitInches')}
              min={0}
              max={11}
              disabled={disabled}
              testID="height-inches-stepper"
            />
          </>
        )}
        {heightError != null && (
          <Text className="text-s2 font-sans text-red-500 text-center">{t(heightError)}</Text>
        )}
      </View>

      {/* Unit toggle */}
      <View className="w-[120px]">
        <UnitToggle
          options={['ft/in', 'cm']}
          value={form.heightUnit === 'cm' ? 'cm' : 'ft/in'}
          onChange={handleUnitChange}
          testID="height-unit-toggle"
        />
      </View>
    </View>
  );
}
