import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';
import { StepperInput } from '@shared/components/ui/StepperInput';
import { UnitToggle } from '@shared/components/ui/UnitToggle';
import type { ProfileForm, WeightUnit } from '../types/profile.types';

interface Props {
  form: Pick<ProfileForm, 'weight' | 'weightUnit'>;
  errors: Partial<Record<keyof ProfileForm, string>>;
  onChange: <K extends keyof ProfileForm>(field: K, value: ProfileForm[K]) => void;
  disabled?: boolean;
}

export function WeightStep({ form, errors, onChange, disabled }: Props) {
  const { t } = useTranslation();

  const step   = form.weightUnit === 'kg' ? 1 : 1;
  const maxVal = form.weightUnit === 'kg' ? 300 : 660;

  function handleUnitChange(unit: string) {
    onChange('weightUnit', unit as WeightUnit);
    onChange('weight', 0);
  }

  return (
    <View className="items-center gap-12 w-full">
      {/* Figma: stepper wrapper ~199px wide, centred */}
      <View className="w-[199px]">
        <StepperInput
          value={form.weight}
          onIncrement={() => onChange('weight', Math.min(maxVal, form.weight + step))}
          onDecrement={() => onChange('weight', Math.max(0, form.weight - step))}
          label={t('patientProfile.weightLabel')}
          min={0}
          max={maxVal}
          disabled={disabled}
          testID="weight-stepper"
        />
        {errors.weight != null && (
          <Text className="text-s2 font-sans text-red-500 mt-1 text-center">{t(errors.weight)}</Text>
        )}
      </View>

      {/* Unit toggle — 120px wide */}
      <View className="w-[120px]">
        <UnitToggle
          options={['kg', 'lbs']}
          value={form.weightUnit}
          onChange={handleUnitChange}
          testID="weight-unit-toggle"
        />
      </View>
    </View>
  );
}
