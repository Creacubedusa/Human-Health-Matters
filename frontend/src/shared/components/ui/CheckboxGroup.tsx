import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export interface CheckboxOption {
  label: string;
  value: string;
}

export interface CheckboxGroupProps {
  options: CheckboxOption[];
  values: string[];
  onChange: (values: string[]) => void;
  noneValue?: string;
  disabled?: boolean;
  testID?: string;
}

type BoxState = 'checked' | 'unchecked' | 'disabled';

const BOX_BG: Record<BoxState, string> = {
  checked:   'bg-primary-500 border-primary-500',
  unchecked: 'bg-white border-grey-300',
  disabled:  'bg-grey-50 border-grey-200',
};

const LABEL_COLOR: Record<BoxState, string> = {
  checked:   'text-grey-900',
  unchecked: 'text-grey-700',
  disabled:  'text-grey-400',
};

export function CheckboxGroup({
  options,
  values,
  onChange,
  noneValue = 'none',
  disabled = false,
  testID,
}: CheckboxGroupProps) {
  function handlePress(optValue: string) {
    if (disabled) return;

    if (optValue === noneValue) {
      onChange(values.includes(noneValue) ? [] : [noneValue]);
      return;
    }

    const withoutNone = values.filter((v) => v !== noneValue);
    if (withoutNone.includes(optValue)) {
      onChange(withoutNone.filter((v) => v !== optValue));
    } else {
      onChange([...withoutNone, optValue]);
    }
  }

  return (
    <View className="gap-3" testID={testID}>
      {options.map((opt) => {
        const checked = values.includes(opt.value);
        const state: BoxState = disabled ? 'disabled' : checked ? 'checked' : 'unchecked';
        return (
          <Pressable
            key={opt.value}
            onPress={() => handlePress(opt.value)}
            className="flex-row items-center gap-3"
            accessibilityRole="checkbox"
            accessibilityState={{ checked, disabled }}
          >
            <View
              className={[
                'w-5 h-5 rounded-sm border-2 items-center justify-center',
                BOX_BG[state],
              ].join(' ')}
            >
              {checked && (
                <Ionicons name="checkmark" size={12} color="#ffffff" />
              )}
            </View>
            <Text className={['text-b2 font-sans flex-1', LABEL_COLOR[state]].join(' ')}>
              {opt.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
