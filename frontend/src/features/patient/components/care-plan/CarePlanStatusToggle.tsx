import { Pressable, Text, View } from 'react-native';
import type { CarePlanStatus } from '../../types/carePlan.types';

interface CarePlanStatusToggleProps {
  activeStatus: CarePlanStatus;
  onChange: (status: CarePlanStatus) => void;
  activeLabel: string;
  inactiveLabel: string;
}

export function CarePlanStatusToggle({
  activeStatus,
  onChange,
  activeLabel,
  inactiveLabel,
}: CarePlanStatusToggleProps) {
  return (
    <View className="flex-row items-center justify-between w-full">
      {(['active', 'inactive'] as CarePlanStatus[]).map((status) => {
        const isSelected = activeStatus === status;
        const label = status === 'active' ? activeLabel : inactiveLabel;

        return (
          <Pressable
            key={status}
            onPress={() => onChange(status)}
            className={[
              'h-10 rounded-full px-5 items-center justify-center',
              isSelected ? 'bg-primary-500' : 'bg-primary-50',
            ].join(' ')}
            accessibilityRole="tab"
            accessibilityState={{ selected: isSelected }}
          >
            <Text
              className={[
                'text-btn-medium font-semibold font-sans',
                isSelected ? 'text-white' : 'text-primary-500',
              ].join(' ')}
            >
              {label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
