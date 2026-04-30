import { Image, View } from 'react-native';

export interface DoctorAvatarProps {
  uri: string;
  size?: 'card' | 'hero';
  showAvailability?: boolean;
}

const IMAGE_CLASS = {
  card: 'h-12 w-12 rounded-full bg-grey-50',
  hero: 'h-14 w-14 rounded-full bg-grey-50',
} as const;

const DOT_CLASS = {
  card: 'absolute bottom-0 right-0 h-5 w-5 rounded-full border-2 border-white bg-green-500',
  hero: 'absolute bottom-0 right-0 h-4 w-4 rounded-full border-2 border-white bg-green-500',
} as const;

export function DoctorAvatar({
  uri,
  size = 'card',
  showAvailability = true,
}: DoctorAvatarProps) {
  return (
    <View className="relative">
      <Image
        source={{ uri }}
        resizeMode="cover"
        className={IMAGE_CLASS[size]}
      />
      {showAvailability ? <View className={DOT_CLASS[size]} /> : null}
    </View>
  );
}
