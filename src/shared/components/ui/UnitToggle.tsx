import { Pressable, Text, View } from 'react-native';

export interface UnitToggleProps {
  options: [string, string];
  value: string;
  onChange: (value: string) => void;
  testID?: string;
}

// Figma: bg-grey-100 container rounded-[8px], active pill bg-primary-500, inactive transparent
// Width: 120px, each pill: 50px wide
export function UnitToggle({ options, value, onChange, testID }: UnitToggleProps) {
  return (
    <View
      className="flex-row bg-grey-100 rounded-lg p-1 gap-1"
      testID={testID}
    >
      {options.map((opt) => {
        const active = opt === value;
        return (
          <Pressable
            key={opt}
            onPress={() => onChange(opt)}
            className={[
              'flex-1 items-center justify-center py-1.5 px-3 rounded-lg',
              active ? 'bg-primary-500' : '',
            ].join(' ')}
            accessibilityRole="button"
            accessibilityState={{ selected: active }}
          >
            <Text
              className={[
                'text-s2 font-sans',
                active ? 'text-grey-200' : 'text-primary-500',
              ].join(' ')}
            >
              {opt}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
