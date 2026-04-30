import { FlatList, Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { primitiveColors } from '@design/tokens';
import { Badge } from '@shared/components/ui/Badge';
import type { TranscriptEntry, TranscriptionStatus } from '../../types/consultation.types';

export interface TranscriptionPanelProps {
  status: TranscriptionStatus;
  transcript: TranscriptEntry[];
  onClose: () => void;
}

const STATUS_BADGE: Record<TranscriptionStatus, { label: string; badgeStatus: 'info' | 'success' | 'error' | 'default' }> = {
  idle: { label: 'consultation.transcriptionIdle', badgeStatus: 'default' },
  requesting: { label: 'consultation.transcriptionRequesting', badgeStatus: 'info' },
  active: { label: 'consultation.transcriptionProgress', badgeStatus: 'success' },
  error: { label: 'consultation.transcriptionError', badgeStatus: 'error' },
};

export function TranscriptionPanel({ status, transcript, onClose }: TranscriptionPanelProps) {
  const { t } = useTranslation();
  const badgeInfo = STATUS_BADGE[status];

  return (
    <View className="absolute bottom-0 left-0 right-0 h-[65%] bg-white rounded-t-2xl">
      {/* Handle */}
      <View className="items-center pt-3 pb-1">
        <View className="w-10 h-1 rounded-full bg-grey-300" />
      </View>

      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-3 border-b border-grey-100">
        <Text className="text-s2 text-text-primary font-sans">
          {t('consultation.transcriptionTitle')}
        </Text>
        <Pressable onPress={onClose} accessibilityRole="button" accessibilityLabel="Close transcription">
          <Ionicons name="close" size={24} color={primitiveColors['grey-600']} />
        </Pressable>
      </View>

      {/* Status badge */}
      <View className="px-4 pt-3 pb-1">
        <Badge label={t(badgeInfo.label)} status={badgeInfo.badgeStatus} variant="filled" size="small" />
      </View>

      {/* Transcript entries */}
      {transcript.length === 0 ? (
        <View className="flex-1 items-center justify-center gap-2">
          <Ionicons name="mic-outline" size={40} color={primitiveColors['grey-300']} />
          <Text className="text-b3 text-text-tertiary font-sans">
            {t('consultation.transcriptionEmpty')}
          </Text>
        </View>
      ) : (
        <FlatList
          data={transcript}
          keyExtractor={(item) => item.id}
          contentContainerClassName="px-4 py-3 gap-4"
          renderItem={({ item }) => (
            <View className="gap-1">
              <Text className="text-c1 text-text-tertiary font-sans font-semibold">
                {item.speaker}
              </Text>
              <Text className="text-b3 text-text-secondary font-sans italic">
                {item.originalText}
              </Text>
              <Text className="text-b3 text-text-primary font-sans">{item.translatedText}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
}
