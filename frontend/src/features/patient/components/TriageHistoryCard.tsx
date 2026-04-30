import { Pressable, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import type { TriageHistoryItem } from '../types/triage.types';

export interface TriageHistoryCardProps {
  item: TriageHistoryItem;
  onViewSummary: () => void;
}

export function TriageHistoryCard({ item, onViewSummary }: TriageHistoryCardProps) {
  const { t } = useTranslation();

  return (
    <Pressable
      onPress={onViewSummary}
      className="bg-white border border-grey-100 rounded-xl px-4 py-3 flex-row items-start justify-between"
      accessibilityRole="button"
    >
      <View className="flex-1 gap-1 mr-4">
        <Text className="text-[15px] font-semibold font-sans text-grey-900">{item.title}</Text>
        <Text className="text-[13px] font-sans text-grey-500">{item.description}</Text>
      </View>

      <View className="items-end gap-1">
        <Text className="text-[12px] font-sans text-grey-400">{item.date}</Text>
        <Pressable onPress={onViewSummary} accessibilityRole="button">
          <Text className="text-[13px] font-semibold font-sans text-primary-500">
            {t('nuraAI.viewSummary')}
          </Text>
        </Pressable>
      </View>
    </Pressable>
  );
}
