import { ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { primitiveColors } from '@design/tokens';
import { Button } from '@shared/components/ui/Button';
import { Input } from '@shared/components/ui/Input';
import { DonorHistoryCard } from '../components/history/DonorHistoryCard';
import { useDonorHistory } from '../hooks/useDonorHistory';

export function DonorHistoryView() {
  const { t } = useTranslation();
  const { status, items, fromDate, toDate, setFromDate, setToDate, retry } = useDonorHistory();

  const calendarIcon = (
    <Ionicons name="calendar-outline" size={18} color={primitiveColors['grey-400']} />
  );

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      {/* Header */}
      <View className="bg-primary-50 px-5 py-4 items-center justify-center">
        <Text className="text-s1 font-semibold font-sans text-grey-900">
          {t('donorHistory.headerTitle')}
        </Text>
      </View>

      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Date filter row */}
        <View className="flex-row gap-3 px-5 pt-5 pb-4">
          <View className="flex-1">
            <Input
              label={t('donorHistory.fromLabel')}
              placeholder={t('donorHistory.fromPlaceholder')}
              value={fromDate}
              onChangeText={setFromDate}
              iconRight={calendarIcon}
            />
          </View>
          <View className="flex-1">
            <Input
              label={t('donorHistory.toLabel')}
              placeholder={t('donorHistory.toPlaceholder')}
              value={toDate}
              onChangeText={setToDate}
              iconRight={calendarIcon}
            />
          </View>
        </View>

        {/* Loading */}
        {status === 'loading' && (
          <View className="flex-1 items-center justify-center gap-3">
            <ActivityIndicator size="large" color={primitiveColors['primary-500']} />
            <Text className="text-b2 font-sans text-grey-500">{t('common.loading')}</Text>
          </View>
        )}

        {/* Error */}
        {status === 'error' && (
          <View className="flex-1 items-center justify-center px-6 gap-4">
            <Ionicons name="alert-circle-outline" size={48} color={primitiveColors['grey-300']} />
            <Text className="text-b2 font-sans text-grey-500 text-center">
              {t('donorHistory.errorMessage')}
            </Text>
            <Button label={t('common.retry')} variant="outline" size="medium" onPress={() => void retry()} />
          </View>
        )}

        {/* Empty */}
        {status === 'success' && items.length === 0 && (
          <View className="flex-1 items-center justify-center px-6 gap-3">
            <Ionicons name="time-outline" size={48} color={primitiveColors['grey-300']} />
            <Text className="text-s2 font-semibold font-sans text-grey-900 text-center">
              {t('donorHistory.emptyTitle')}
            </Text>
            <Text className="text-b2 font-sans text-grey-400 text-center">
              {t('donorHistory.emptySubtitle')}
            </Text>
          </View>
        )}

        {/* Success */}
        {status === 'success' && items.length > 0 && (
          <ScrollView
            className="flex-1"
            contentContainerClassName="px-5 pb-10 gap-4"
            showsVerticalScrollIndicator={false}
          >
            {items.map((item) => (
              <DonorHistoryCard key={item.id} item={item} />
            ))}
          </ScrollView>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
