import { Pressable, Text, View } from 'react-native';
import type { PrescriptionListItem } from '../../types/prescription.types';

export interface PrescriptionCardProps {
  item: PrescriptionListItem;
  labels: {
    activeStatus: string;
    inactiveStatus: string;
    refillLeft: string;
    noRefillLeft: string;
  };
  onPress: (id: string) => void;
}

export function PrescriptionCard({ item, labels, onPress }: PrescriptionCardProps) {
  const isActive = item.status === 'active';

  const refillText =
    item.refillsLeft > 0
      ? labels.refillLeft.replace('{{count}}', String(item.refillsLeft))
      : labels.noRefillLeft;

  const initials = item.doctorName
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <Pressable
      onPress={() => onPress(item.id)}
      className="bg-white rounded-2xl overflow-hidden shadow-200"
      accessibilityRole="button"
    >
      {/* Blue header */}
      <View className="bg-primary-500 px-4 pt-3.5 pb-4">
        <View className="flex-row items-start justify-between">
          {/* Left: avatar + doctor name + date */}
          <View className="gap-3">
            <View className="flex-row items-center gap-2">
              <View className="h-6 w-6 rounded-full bg-white items-center justify-center">
                <Text className="text-c3 font-semibold font-sans text-primary-500">{initials}</Text>
              </View>
              <Text className="text-s2 font-semibold font-sans text-white">{item.doctorName}</Text>
            </View>
            <Text className="text-c1 font-sans text-white/60">{item.date}</Text>
          </View>

          {/* Right: status badge + refill text */}
          <View className="items-end gap-1">
            <View
              className={[
                'h-6 rounded-xs px-2 items-center justify-center',
                isActive ? 'bg-blue-50' : 'bg-blue-50',
              ].join(' ')}
            >
              <Text
                className={[
                  'text-btn-tiny font-semibold font-sans',
                  isActive ? 'text-blue-500' : 'text-grey-400',
                ].join(' ')}
              >
                {isActive ? labels.activeStatus : labels.inactiveStatus}
              </Text>
            </View>
            <Text className="text-c1 font-sans text-white/60 text-right">{refillText}</Text>
          </View>
        </View>
      </View>

      {/* White body: medication + bullet details */}
      <View className="px-4 pt-4 pb-4 gap-2">
        <Text className="text-b4 font-medium font-sans text-grey-900">{item.medication}</Text>
        {item.details?.map((line, i) => (
          <Text key={i} className="text-c1 font-sans text-grey-500">
            {'• '}{line}
          </Text>
        ))}
      </View>
    </Pressable>
  );
}
