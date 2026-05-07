import { FlatList, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'expo-router';
import { HeaderBackButton } from '@shared/components/ui/HeaderBackButton';
import { useDoctorNuraAI } from '../hooks/useDoctorNuraAI';
import { DoctorHistoryItem } from '../components/nura/DoctorHistoryItem';
import type { DoctorAIHistoryItem } from '../types/doctorNuraAI.types';

export function DoctorNuraAIHistoryView() {
  const { t } = useTranslation();
  const router = useRouter();
  const { historyList, setSelectedSummary } = useDoctorNuraAI();

  function handleViewSummary(item: DoctorAIHistoryItem) {
    setSelectedSummary(item);
    router.push('/(doctor)/nura-ai-summary');
  }

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      {/* Header */}
      <View className="bg-primary-50 px-4 pb-4 pt-2">
        <View className="flex-row items-center justify-between h-[29px]">
          <HeaderBackButton
            onPress={() => router.back()}
            accessibilityLabel={t('common.back')}
          />
          <Text className="text-s2 font-semibold font-sans text-grey-900 absolute left-0 right-0 text-center pointer-events-none">
            {t('doctorNuraAI.historyTitle')}
          </Text>
          <View className="w-[29px]" />
        </View>
      </View>

      {historyList.length === 0 ? (
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-b1 font-sans text-grey-500 text-center">
            {t('doctorNuraAI.historyEmpty')}
          </Text>
        </View>
      ) : (
        <FlatList
          data={historyList}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerClassName="px-4 pt-6 pb-8 gap-4"
          ListHeaderComponent={
            <Text className="text-h5 font-semibold font-sans text-grey-900 mb-2">
              {t('doctorNuraAI.historyTitle')}
            </Text>
          }
          renderItem={({ item }) => (
            <DoctorHistoryItem
              item={item}
              onViewSummary={handleViewSummary}
              testID={`history-item-${item.id}`}
            />
          )}
        />
      )}
    </SafeAreaView>
  );
}
