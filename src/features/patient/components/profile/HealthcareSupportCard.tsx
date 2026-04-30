import { Ionicons } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';
import { primitiveColors } from '@design/tokens';
import type { HealthcareSupport } from '../../types/profileOverview.types';

interface HealthcareSupportCardProps {
  support: HealthcareSupport;
  onPress: () => void;
}

export function HealthcareSupportCard({ support, onPress }: HealthcareSupportCardProps) {
  return (
    <Pressable
      onPress={onPress}
      className="bg-primary-50 rounded-2xl p-4 flex-row items-center justify-between w-full"
      accessibilityRole="button"
    >
      <View className="flex-row items-center gap-3 flex-1 pr-4">
        <Ionicons name="heart" size={32} color={primitiveColors['primary-500']} />
        <View className="gap-1 flex-1">
          <Text className="text-s2 font-semibold font-sans text-grey-900">{support.title}</Text>
          <Text className="text-b4 font-sans text-grey-600">{support.subtitle}</Text>
        </View>
      </View>
      <Ionicons name="chevron-forward" size={18} color={primitiveColors['grey-900']} />
    </Pressable>
  );
}
