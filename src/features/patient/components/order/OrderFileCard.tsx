import { Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { primitiveColors } from '@design/tokens';
import type { UploadedFile } from '../../types/order.types';

export interface OrderFileCardProps {
  file: UploadedFile;
  onRemove: () => void;
}

export function OrderFileCard({ file, onRemove }: OrderFileCardProps) {
  return (
    <View className="border border-grey-300 rounded-2xl shadow-700 px-3 py-5 gap-3">
      {/* Top row: icon + filename + remove */}
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-6">
          <View className="bg-grey-900 rounded-2xl size-8 items-center justify-center">
            <Ionicons name="document" size={16} color={primitiveColors.white} />
          </View>
          <Text className="text-b4 font-medium font-sans text-grey-900 flex-1" numberOfLines={1}>
            {file.name}
          </Text>
        </View>
        <Pressable
          onPress={onRemove}
          accessibilityRole="button"
          accessibilityLabel="Remove file"
          className="size-6 items-center justify-center"
        >
          <Ionicons name="close" size={20} color={primitiveColors['grey-900']} />
        </Pressable>
      </View>

      {/* Progress bar + labels */}
      <View className="gap-1">
        {/* Track */}
        <View className="h-[5px] bg-grey-100 rounded-full overflow-hidden">
          <View
            className="h-full bg-primary-500 rounded-full"
            style={{ width: `${file.progress}%` }}
          />
        </View>
        <View className="flex-row items-center justify-between">
          <Text className="text-b4 font-medium font-sans text-grey-900">{file.sizeMb}MB</Text>
          <Text className="text-b3 font-sans text-grey-900">{file.progress} %</Text>
        </View>
      </View>
    </View>
  );
}
