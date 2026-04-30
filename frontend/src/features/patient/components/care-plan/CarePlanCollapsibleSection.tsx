import { Ionicons } from '@expo/vector-icons';
import { PropsWithChildren, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { primitiveColors } from '@design/tokens';

interface CarePlanCollapsibleSectionProps extends PropsWithChildren {
  title: string;
  defaultExpanded?: boolean;
  bordered?: boolean;
}

export function CarePlanCollapsibleSection({
  title,
  defaultExpanded = true,
  bordered = true,
  children,
}: CarePlanCollapsibleSectionProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <View
      className={[
        'bg-white rounded-lg w-full',
        bordered ? 'border border-grey-100' : '',
      ].join(' ')}
    >
      <Pressable
        onPress={() => setIsExpanded((value) => !value)}
        className="flex-row items-center justify-between px-3 pt-3 pb-2"
        accessibilityRole="button"
        accessibilityState={{ expanded: isExpanded }}
      >
        <Text className="text-b2 font-medium font-sans text-grey-900">{title}</Text>
        <Ionicons
          name={isExpanded ? 'chevron-up' : 'chevron-down'}
          size={18}
          color={primitiveColors['grey-600']}
        />
      </Pressable>

      {isExpanded && <View className="px-3 pb-3">{children}</View>}
    </View>
  );
}
