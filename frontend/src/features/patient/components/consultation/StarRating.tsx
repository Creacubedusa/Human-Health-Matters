import { Pressable, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { primitiveColors } from '@design/tokens';

export interface StarRatingProps {
  value: number;
  onChange: (rating: number) => void;
  size?: number;
}

const STARS = [1, 2, 3, 4, 5];

export function StarRating({ value, onChange, size = 36 }: StarRatingProps) {
  return (
    <View className="flex-row gap-2">
      {STARS.map((star) => (
        <Pressable
          key={star}
          onPress={() => onChange(star)}
          accessibilityRole="button"
          accessibilityLabel={`Rate ${star} star${star !== 1 ? 's' : ''}`}
        >
          <Ionicons
            name={star <= value ? 'star' : 'star-outline'}
            size={size}
            // CSS variables not supported in this RN prop — raw hex from primitiveColors
            color={star <= value ? primitiveColors['yellow-500'] : primitiveColors['grey-300']}
          />
        </Pressable>
      ))}
    </View>
  );
}
