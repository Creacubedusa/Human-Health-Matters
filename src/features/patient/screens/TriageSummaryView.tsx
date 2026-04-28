import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { primitiveColors } from '@design/tokens';

export interface TriageSummaryViewProps {
  onBack: () => void;
  summary: string;
}

export function TriageSummaryView({ onBack, summary }: TriageSummaryViewProps) {
  const { t } = useTranslation();

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      {/* Header */}
      <View className="bg-primary-50 h-[66px] flex-row items-center justify-between px-4">
        <Pressable
          onPress={onBack}
          className="w-[29px] h-[29px] rounded-lg bg-white items-center justify-center"
          accessibilityRole="button"
          accessibilityLabel={t('common.back')}
        >
          <Ionicons name="chevron-back" size={20} color={primitiveColors['grey-900']} />
        </Pressable>

        <Text className="text-[16px] font-semibold font-sans text-grey-900">
          {t('nuraAI.summaryTitle')}
        </Text>

        <View style={{ width: 29 }} />
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
