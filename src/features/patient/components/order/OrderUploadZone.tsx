import { Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { primitiveColors } from '@design/tokens';
import type { UploadedFile } from '../../types/order.types';

export interface OrderUploadZoneProps {
  onSelectFile: (file: UploadedFile) => void;
  labels: {
    ctaHighlight: string;
    ctaRest: string;
    maxSize: string;
    maxSizeValue: string;
  };
}

export function OrderUploadZone({ onSelectFile, labels }: OrderUploadZoneProps) {
  function handlePress() {
    onSelectFile({ name: 'Bloodtest.pdf', sizeMb: 10, progress: 0 });
  }

  return (
    <Pressable
      onPress={handlePress}
      className="border border-primary-200 border-dashed rounded-2xl h-[174px] items-center justify-center gap-3"
      accessibilityRole="button"
    >
      {/* Upload icon */}
      <View className="bg-primary-50 rounded-2xl size-12 items-center justify-center">
        <Ionicons name="cloud-upload-outline" size={24} color={primitiveColors['primary-500']} />
      </View>

      {/* CTA text */}
      <Text className="text-b3 font-sans text-grey-500">
        <Text className="text-b3 font-semibold font-sans text-primary-500">{labels.ctaHighlight}</Text>
        {' '}{labels.ctaRest}
      </Text>

      {/* Size note */}
      <Text className="text-c1 font-sans text-grey-500">
        {labels.maxSize}{' '}
        <Text className="text-c1 font-medium font-sans text-grey-900">{labels.maxSizeValue}</Text>
      </Text>
    </Pressable>
  );
}
