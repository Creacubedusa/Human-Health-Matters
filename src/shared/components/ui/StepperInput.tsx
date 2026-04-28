import { Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { primitiveColors } from '@design/tokens';

export interface StepperInputProps {
  value: number;
  onIncrement: () => void;
  onDecrement: () => void;
  label: string;
  min?: number;
  max?: number;
  disabled?: boolean;
  testID?: string;
}

// Figma: [−] [value\nlabel] [+]  — grey side buttons, white center
export function StepperInput({
  value,
  onIncrement,
  onDecrement,
  label,
  min,
  max,
  disabled = false,
  testID,
}: StepperInputProps) {
  const canDecrement = !disabled && (min === undefined || value > min);
  const canIncrement = !disabled && (max === undefined || value < max);

  return (
    <View className="flex-row items-stretch" testID={testID}>
      {/* Minus button */}
      <Pressable
        onPress={onDecrement}
        disabled={!canDecrement}
        className={[
          'items-center justify-center px-6 py-3.5 border border-grey-200 rounded-l-lg bg-grey-50',
          !canDecrement ? 'opacity-40' : '',
        ].join(' ')}
        accessibilityRole="button"
        accessibilityLabel="Decrease"
      >
        <Ionicons name="remove" size={16} color={primitiveColors['grey-900']} />
      </Pressable>

      {/* Value display */}
      <View className="flex-1 items-center justify-center border border-grey-200 rounded-lg bg-white px-4 py-3.5 mx-[-1px]">
        <Text className="text-b1 font-sans text-grey-900 leading-none">{value}</Text>
        <Text className="text-s2 font-sans text-grey-400 mt-0.5">{label}</Text>
      </View>

      {/* Plus button */}
      <Pressable
        onPress={onIncrement}
        disabled={!canIncrement}
        className={[
          'items-center justify-center px-6 py-3.5 border border-grey-200 rounded-r-lg bg-grey-50',
          !canIncrement ? 'opacity-40' : '',
        ].join(' ')}
        accessibilityRole="button"
        accessibilityLabel="Increase"
      >
        <Ionicons name="add" size={16} color={primitiveColors['grey-900']} />
      </Pressable>
    </View>
  );
}
