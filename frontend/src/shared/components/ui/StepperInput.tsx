import { useEffect, useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { primitiveColors } from '@design/tokens';

export interface StepperInputProps {
  value: number;
  onChangeValue?: (value: number) => void;
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
  onChangeValue,
  onIncrement,
  onDecrement,
  label,
  min,
  max,
  disabled = false,
  testID,
}: StepperInputProps) {
  const [draftValue, setDraftValue] = useState(String(value));
  const canDecrement = !disabled && (min === undefined || value > min);
  const canIncrement = !disabled && (max === undefined || value < max);

  useEffect(() => {
    setDraftValue(String(value));
  }, [value]);

  function clampValue(rawValue: number) {
    let nextValue = rawValue;
    if (min !== undefined) nextValue = Math.max(min, nextValue);
    if (max !== undefined) nextValue = Math.min(max, nextValue);
    return nextValue;
  }

  function handleTextChange(text: string) {
    if (!onChangeValue) return;

    const digitsOnly = text.replace(/[^\d]/g, '');
    setDraftValue(digitsOnly);

    if (digitsOnly.length === 0) {
      return;
    }

    const nextValue = Number.parseInt(digitsOnly, 10);
    if (Number.isNaN(nextValue)) return;
    onChangeValue(clampValue(nextValue));
  }

  function handleBlur() {
    if (!onChangeValue) return;

    if (draftValue.length === 0) {
      const resetValue = min ?? 0;
      setDraftValue(String(resetValue));
      onChangeValue(resetValue);
      return;
    }

    const parsedValue = Number.parseInt(draftValue, 10);
    if (Number.isNaN(parsedValue)) {
      const resetValue = min ?? 0;
      setDraftValue(String(resetValue));
      onChangeValue(resetValue);
      return;
    }

    const clampedValue = clampValue(parsedValue);
    setDraftValue(String(clampedValue));
    onChangeValue(clampedValue);
  }

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
        <TextInput
          value={draftValue}
          onChangeText={handleTextChange}
          onBlur={handleBlur}
          editable={!disabled}
          keyboardType="numeric"
          textAlign="center"
          className="min-w-[32px] p-0 text-center text-b1 font-sans text-grey-900 leading-none"
          accessibilityLabel={label}
          selectTextOnFocus
        />
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
