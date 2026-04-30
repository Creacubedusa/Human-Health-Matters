import { Text, View } from 'react-native';
import { HeaderBackButton } from '@shared/components/ui/HeaderBackButton';

interface ProfileHeaderProps {
  title: string;
  backLabel: string;
  onBack?: () => void;
}

export function ProfileHeader({ title, backLabel, onBack }: ProfileHeaderProps) {
  return (
    <View className="bg-primary-50 h-[66px] w-full justify-end">
      <View className="flex-row items-center justify-between px-4 pb-3 h-[48px]">
        <HeaderBackButton onPress={onBack} disabled={!onBack} accessibilityLabel={backLabel} />

        <Text className="text-s2 font-semibold font-sans text-grey-900">{title}</Text>

        <View className="w-[29px]" />
      </View>
    </View>
  );
}
