import { Pressable, ScrollView, Text } from 'react-native';

export interface PrescriptionFilterTabsProps<T extends string = string> {
  options: Array<{ label: string; value: T }>;
  activeValue: T;
  onChange: (value: T) => void;
}

export function PrescriptionFilterTabs<T extends string = string>({
  options,
  activeValue,
  onChange,
}: PrescriptionFilterTabsProps<T>) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerClassName="flex-row gap-3"
    >
      {options.map((option) => {
        const isActive = option.value === activeValue;
        return (
          <Pressable
            key={option.value}
            onPress={() => onChange(option.value)}
            className={[
              'h-10 rounded-full px-5 items-center justify-center',
              isActive ? 'bg-primary-500' : 'bg-primary-50',
            ].join(' ')}
            accessibilityRole="button"
          >
            <Text
              className={[
                'text-btn-medium font-semibold font-sans',
                isActive ? 'text-white' : 'text-primary-500',
              ].join(' ')}
            >
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}
