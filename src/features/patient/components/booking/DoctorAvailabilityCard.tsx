import { Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { primitiveColors } from '@design/tokens';

export interface DoctorAvailabilityCardProps {
  title: string;
  value: string;
}

export function DoctorAvailabilityCard({
  title,
  value,
}: DoctorAvailabilityCardProps) {
  return (
    <Pressable className="rounded-[24px] border border-grey-300 bg-white px-[11px] py-[14px]">
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-4">
          <View className="h-14 w-14 rounded-xl bg-primary-50 items-center justify-center">
            <Ionicons name="time-outline" size={24} color={primitiveColors['primary-500']} />
          </View>
          <View className="gap-1.5">
            <Text className="text-b2 font-medium font-sans text-grey-500">
              {title}
            </Text>
            <Text className="text-s2 font-semibold font-sans text-grey-900">
              {value}
            </Text>
          </View>
        </View>

        <Ionicons name="chevron-forward" size={24} color={primitiveColors['grey-900']} />
      </View>
    </Pressable>
  );
}
