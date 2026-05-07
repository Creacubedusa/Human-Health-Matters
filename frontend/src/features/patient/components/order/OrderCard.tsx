import { Pressable, Text, View } from 'react-native';
import { Badge } from '@shared/components/ui/Badge';
import type { OrderListItem } from '../../types/order.types';

export interface OrderCardProps {
  item: OrderListItem;
  labels: {
    urgent: string;
    notUrgent: string;
    orderedBy: string;
  };
  onPress?: (id: string) => void;
}

export function OrderCard({ item, labels, onPress }: OrderCardProps) {
  const isUrgent = item.priority === 'urgent';

  return (
    <Pressable
      onPress={onPress ? () => onPress(item.id) : undefined}
      className="bg-white border border-grey-300 rounded-lg overflow-hidden"
      accessibilityRole={onPress ? 'button' : undefined}
      accessibilityLabel={item.testName}
    >
      <View className="flex-row items-center justify-between px-3 h-[90px]">
        {/* Left: test name + ordered by */}
        <View className="flex-1 gap-2 pr-4">
          <Text className="text-s2 font-semibold font-sans text-grey-900" numberOfLines={1}>
            {item.testName}
          </Text>
          <Text className="text-b3 font-sans text-grey-500" numberOfLines={1}>
            {labels.orderedBy} {item.orderedBy}
          </Text>
        </View>

        {/* Right: date + badge */}
        <View className="items-end gap-3">
          <Text className="text-c3 font-sans text-grey-600">{item.date}</Text>
          <Badge
            label={isUrgent ? labels.urgent : labels.notUrgent}
            status={isUrgent ? 'error' : 'info'}
            variant="filled"
            size="tiny"
          />
        </View>
      </View>
    </Pressable>
  );
}
