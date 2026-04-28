import { Ionicons } from '@expo/vector-icons';
import { View } from 'react-native';
import { primitiveColors } from '@design/tokens';

export interface NuraAvatarProps {
  size?: 'small' | 'large';
}

const CONTAINER_CLASS = {
  small: 'h-12 w-12 rounded-full border-4 border-blue-50 bg-primary-100 items-center justify-center',
  large: 'h-14 w-14 rounded-full border-4 border-blue-50 bg-primary-100 items-center justify-center',
} as const;

const ICON_SIZE = {
  small: 20,
  large: 24,
} as const;

export function NuraAvatar({ size = 'small' }: NuraAvatarProps) {
  return (
    <View className={CONTAINER_CLASS[size]}>
      <Ionicons name="sparkles" size={ICON_SIZE[size]} color={primitiveColors['primary-500']} />
    </View>
  );
}
