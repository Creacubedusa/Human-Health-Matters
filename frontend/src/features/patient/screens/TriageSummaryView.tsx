import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { primitiveColors } from '@design/tokens';
import { HeaderBackButton } from '@shared/components/ui/HeaderBackButton';

export interface TriageSummaryViewProps {
  onBack: () => void;
  summary: string;
}

export function TriageSummaryView({ onBack, summary }: TriageSummaryViewProps) {
  const { t } = useTranslation();

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      {/* Header */}
      <View className="bg-primary-50 h-[66px] justify-end">
        <View className="h-[48px] flex-row items-center justify-between px-4 pb-3">
          <HeaderBackButton onPress={onBack} accessibilityLabel={t('common.back')} />

          <Text className="text-[16px] font-semibold font-sans text-grey-900">
            {t('nuraAI.summaryTitle')}
          </Text>

          <View style={{ width: 29 }} />
        </View>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerClassName="px-5 pt-6 pb-10 gap-4"
        showsVerticalScrollIndicator={false}
      >
        <Text className="text-[22px] font-bold font-sans text-grey-900">
          {t('nuraAI.assessmentSummary')}
        </Text>
        <Text className="text-[15px] font-sans text-grey-600 leading-6">{summary}</Text>
      </ScrollView>
    </SafeAreaView>
  );
}
