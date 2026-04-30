import { ActivityIndicator, FlatList, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { primitiveColors } from '@design/tokens';
import { HeaderBackButton } from '@shared/components/ui/HeaderBackButton';
import { useTriageHistory } from '../hooks/useTriageHistory';
import { TriageHistoryCard } from '../components/TriageHistoryCard';

export interface TriageHistoryViewProps {
  onBack: () => void;
  onViewSummary: (id: string) => void;
}

export function TriageHistoryView({ onBack, onViewSummary }: TriageHistoryViewProps) {
  const { t } = useTranslation();
  const { history, status, retry } = useTriageHistory();

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      {/* Header */}
      <View className="bg-primary-50 h-[66px] justify-end">
        <View className="h-[48px] flex-row items-center justify-between px-4 pb-3">
          <HeaderBackButton onPress={onBack} accessibilityLabel={t('common.back')} />

          <Text className="text-[16px] font-semibold font-sans text-grey-900">
            {t('nuraAI.historyTitle')}
          </Text>

          <View style={{ width: 29 }} />
        </View>
      </View>

      {/* Loading */}
      {status === 'loading' && (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={primitiveColors['primary-500']} />
        </View>
      )}

      {/* Error */}
      {status === 'error' && (
        <View className="flex-1 items-center justify-center px-6 gap-4">
          <Text className="text-[15px] font-sans text-grey-700 text-center">
            {t('nuraAI.errorMessage')}
          </Text>
          <Pressable
            onPress={retry}
            className="bg-primary-500 rounded-xl px-6 py-3"
            accessibilityRole="button"
          >
            <Text className="text-[14px] font-semibold font-sans text-white">
              {t('common.retry')}
            </Text>
          </Pressable>
        </View>
      )}

      {/* Empty */}
      {status === 'success' && history.length === 0 && (
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-[15px] font-sans text-grey-500 text-center">
            {t('nuraAI.historyEmpty')}
          </Text>
        </View>
      )}

      {/* Success */}
      {status === 'success' && history.length > 0 && (
        <FlatList
          className="flex-1"
          contentContainerClassName="px-5 pt-6 gap-3 pb-8"
          data={history}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <Text className="text-[22px] font-bold font-sans text-grey-900 mb-1">
              {t('nuraAI.historyTitle')}
            </Text>
          }
          renderItem={({ item }) => (
            <TriageHistoryCard item={item} onViewSummary={() => onViewSummary(item.id)} />
          )}
        />
      )}
    </SafeAreaView>
  );
}
