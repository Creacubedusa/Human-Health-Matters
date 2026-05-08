import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { primitiveColors } from '@design/tokens';
import { ScreenHeader } from '@shared/components/ui/ScreenHeader';
import { useDoctorNuraAI } from '../hooks/useDoctorNuraAI';

const FALLBACK_SUMMARY =
  'Based on your symptoms—chest pressure, pain spreading to your arm, dizziness, and sweating—this may be a serious heart-related condition. These symptoms are commonly associated with a possible heart attack and require immediate medical attention.';

export function DoctorNuraAISummaryView() {
  const { t } = useTranslation();
  const { selectedSummary } = useDoctorNuraAI();

  const summaryText = selectedSummary?.summaryText ?? FALLBACK_SUMMARY;

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      <ScreenHeader title={t('doctorNuraAI.summaryScreenTitle')} fallbackHref="/(doctor)/nura-ai-history" />

      <ScrollView
        className="flex-1"
        contentContainerClassName="px-4 pt-6 pb-12 gap-6"
        showsVerticalScrollIndicator={false}
      >
        <Text className="text-h5 font-semibold font-sans text-grey-900">
          {t('doctorNuraAI.summaryTitle')}
        </Text>

        <Text className="text-b1 font-sans text-grey-500 leading-6">{summaryText}</Text>

        {/* Safety disclaimer */}
        <View className="bg-yellow-50 border border-yellow-500 rounded-md p-4 gap-2">
          <View className="flex-row items-center gap-2">
            <Ionicons name="warning-outline" size={16} color={primitiveColors['yellow-500']} />
            <Text className="text-c2 font-semibold font-sans text-yellow-700">
              {t('doctorNuraAI.disclaimerTitle')}
            </Text>
          </View>
          <Text className="text-c1 font-sans text-yellow-700">
            {t('doctorNuraAI.disclaimerText')}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
