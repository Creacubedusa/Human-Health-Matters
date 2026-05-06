import { Switch, Text, View } from 'react-native';
import { primitiveColors } from '@design/tokens';

export interface DonorProfileSettingToggleRowProps {
  icon: React.ReactNode;
  label: string;
  value: boolean;
  onValueChange: (v: boolean) => void;
}

export function DonorProfileSettingToggleRow({ icon, label, value, onValueChange }: DonorProfileSettingToggleRowProps) {
  return (
    <View className="flex-row items-center gap-4 py-1">
      <View className="h-6 w-6 items-center justify-center shrink-0">
        {icon}
      </View>
      <Text className="text-b1 font-sans text-grey-900 flex-1">{label}</Text>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: primitiveColors['grey-300'], true: primitiveColors['primary-500'] }}
        thumbColor={primitiveColors.white}
      />
    </View>
  );
}
