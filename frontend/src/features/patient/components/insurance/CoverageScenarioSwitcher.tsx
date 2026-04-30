import { Text, View } from 'react-native';
import { SelectInput } from '@shared/components/ui/SelectInput';
import type { CoverageScenarioOption } from '@features/patient/types/insuranceCoverage.types';

interface CoverageScenarioSwitcherProps {
  label: string;
  helperText: string;
  value: string;
  options: CoverageScenarioOption[];
  onChange: (value: string) => void;
}

export function CoverageScenarioSwitcher({
  label,
  helperText,
  value,
  options,
  onChange,
}: CoverageScenarioSwitcherProps) {
  return (
    <View className="rounded-md border border-blue-500 bg-blue-50 p-4">
      <Text className="mb-1 text-b2 font-semibold font-sans text-grey-900">
        {label}
      </Text>
      <Text className="mb-4 text-b3 font-sans text-grey-500">
        {helperText}
      </Text>
      <SelectInput
        options={options}
        value={value}
        onChange={onChange}
        placeholder={label}
      />
    </View>
  );
}
