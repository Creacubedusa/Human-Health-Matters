import { Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { primitiveColors } from '@design/tokens';
import type { TestFileType } from '../../types/tests.types';

export interface TestResultCardProps {
  mode: 'upload' | 'result';
  fileName?: string;
  fileType?: TestFileType;
  orderedBy: string;
  date: string;
  uploadLabel?: string;
  orderedByLabel: string;
  dateLabel: string;
  onPress?: () => void;
}

export function TestResultCard({
  mode,
  fileName,
  fileType,
  orderedBy,
  date,
  uploadLabel,
  orderedByLabel,
  dateLabel,
  onPress,
}: TestResultCardProps) {
  return (
    <Pressable
      onPress={onPress}
      className="bg-white rounded-2xl overflow-hidden shadow-200"
      accessibilityRole={onPress ? 'button' : undefined}
    >
      {/* Blue top section */}
      <View className="bg-primary-500 h-[90px] items-center justify-center">
        {mode === 'upload' ? (
          /* Upload attachment pill — white-bordered, transparent inside */
          <View className="border border-white rounded-3xl h-11 w-[317px] flex-row items-center justify-center gap-2.5">
            <Ionicons name="attach" size={24} color="rgba(255,255,255,0.6)" />
            <Text className="text-b2 font-medium font-sans text-white/60">
              {uploadLabel}
            </Text>
          </View>
        ) : (
          /* Result file pill — yellow, opaque */
          <View className="bg-yellow-500 rounded-full h-10 w-[287px] flex-row items-center justify-center gap-4">
            <Ionicons
              name={fileType === 'lab' ? 'document-text' : 'image'}
              size={20}
              color={primitiveColors['grey-900']}
            />
            <Text className="text-s2 font-semibold font-sans text-grey-900" numberOfLines={1}>
              {fileName}
            </Text>
          </View>
        )}
      </View>

      {/* White bottom section — metadata */}
      <View className="flex-row items-start justify-between px-4 py-4">
        {/* Ordered by */}
        <View className="gap-3">
          <Text className="text-c1 font-sans text-grey-500">{orderedByLabel}</Text>
          <View className="flex-row items-center gap-2">
            <View className="size-6 rounded-full bg-grey-200 overflow-hidden" />
            <Text className="text-s2 font-semibold font-sans text-grey-900">{orderedBy}</Text>
          </View>
        </View>

        {/* Date */}
        <View className="gap-3">
          <Text className="text-c1 font-sans text-grey-500">{dateLabel}</Text>
          <View className="flex-row items-center gap-2">
            <View className="bg-blue-50 size-4 rounded-full items-center justify-center">
              <Ionicons name="time-outline" size={8} color={primitiveColors['primary-500']} />
            </View>
            <Text className="text-s2 font-semibold font-sans text-grey-900">{date}</Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}
