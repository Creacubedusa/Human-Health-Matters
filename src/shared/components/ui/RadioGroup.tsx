import { Pressable, Text, View } from 'react-native';

export interface RadioOption {
  label: string;
  value: string;
}

export interface RadioGroupProps {
  options: RadioOption[];
  value: string | null;
  onChange: (value: string) => void;
  disabled?: boolean;
  testID?: string;
}

// Figma: 24×24 fully circular, border-primary-500 always, filled dot when selected
export function RadioGroup({ options, value, onChange, disabled = false, testID }: RadioGroupProps) {
  return (
    <View className="gap-6" testID={testID}>
      {options.map((opt) => {
        const selected = value === opt.value;
        return (
          <Pressable
            key={opt.value}
            onPress={() => !disabled && onChange(opt.value)}
            className="flex-row items-center gap-4"
            accessibilityRole="radio"
            accessibilityState={{ checked: selected, disabled }}
          >
            <View className="w-6 h-6 rounded-full border-[1.5px] border-primary-500 items-center justify-center">
              {selected && (
                <View className="w-3 h-3 rounded-full bg-primary-500" />
              )}
            </View>
            <Text className={['text-b1 font-sans', disabled ? 'text-grey-400' : 'text-grey-900'].join(' ')}>
              {opt.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
