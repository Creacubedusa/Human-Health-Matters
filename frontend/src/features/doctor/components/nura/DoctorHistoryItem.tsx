import { Pressable, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import type { DoctorAIHistoryItem } from '../../types/doctorNuraAI.types';

export interface DoctorHistoryItemProps {
  item: DoctorAIHistoryItem;
  onViewSummary: (item: DoctorAIHistoryItem) => void;
  testID?: string;
}

export function DoctorHistoryItem({ item, onViewSummary, testID }: DoctorHistoryItemProps) {
  const { t } = useTranslation();

  return (
    <View
      className="bg-white border border-grey-300 rounded-lg px-4 py-2"
      testID={testID}
    >
      <View className="flex-row items-start justify-between">
        <View className="gap-2 flex-1 mr-4">
          <Text className="text-b4 font-medium font-sans text-grey-900">{item.condition}</Text>
          <Text className="text-c1 font-sans text-grey-500">{item.snippet}</Text>
        </View>

        <View className="items-end gap-1">
          <Text className="text-c3 font-medium font-sans text-grey-500 text-right">
            {item.date}
          </Text>
          <Pressable
            onPress={() => onViewSummary(item)}
            className="px-3 py-2 items-center justify-center"
            accessibilityRole="button"
            accessibilityLabel={t('doctorNuraAI.viewSummary')}
          >
            <Text className="text-btn-small font-semibold font-sans text-primary-500">
              {t('doctorNuraAI.viewSummary')}
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}
