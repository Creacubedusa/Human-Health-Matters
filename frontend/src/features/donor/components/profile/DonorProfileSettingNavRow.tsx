import { Feather } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';
import { primitiveColors } from '@design/tokens';

export interface DonorProfileSettingNavRowProps {
  icon: React.ReactNode;
  label: string;
  onPress: () => void;
}

export function DonorProfileSettingNavRow({ icon, label, onPress }: DonorProfileSettingNavRowProps) {
  return (
    <Pressable
      onPress={onPress}
      className="flex-row items-center gap-3 py-1"
      accessibilityRole="button"
    >
      <View className="w-8 h-8 items-center justify-center shrink-0">
        {icon}
      </View>
      <Text className="text-b1 font-sans text-grey-900 flex-1">{label}</Text>
      <Feather name="chevron-right" size={18} color={primitiveColors['grey-400']} />
    </Pressable>
  );
}
