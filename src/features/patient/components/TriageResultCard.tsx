import { Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { primitiveColors } from '@design/tokens';
import type { TriageResult, TriageSeverity } from '../types/triage.types';

const SEVERITY_STYLES: Record<
  TriageSeverity,
  { iconBg: string; badgeBg: string; badgeText: string; iconColor: string }
> = {
  emergency: {
    iconBg: 'bg-red-50',
    badgeBg: 'bg-red-50',
    badgeText: 'text-red-500',
    iconColor: primitiveColors['red-500'],
  },
  urgent: {
    iconBg: 'bg-red-50',
    badgeBg: 'bg-red-50',
    badgeText: 'text-red-500',
    iconColor: primitiveColors['red-500'],
  },
  moderate: {
    iconBg: 'bg-yellow-50',
    badgeBg: 'bg-yellow-50',
    badgeText: 'text-yellow-600',
    iconColor: primitiveColors['yellow-500'],
  },
  low: {
    iconBg: 'bg-green-50',
    badgeBg: 'bg-green-50',
    badgeText: 'text-green-600',
    iconColor: primitiveColors['green-500'],
  },
};

export interface TriageResultCardProps {
  result: TriageResult;
}

export function TriageResultCard({ result }: TriageResultCardProps) {
  const { t } = useTranslation();
  const styles = SEVERITY_STYLES[result.severity];

  const isEmergencyAlert =
    result.severity === 'emergency' || result.severity === 'urgent';

  return (
    <View className="gap-4">
      {/* Urgency card */}
      <View className="bg-white border border-grey-100 rounded-2xl p-4 flex-row items-center justify-between">
        <View className="flex-row items-center gap-3">
          <View className={`w-12 h-12 rounded-full items-center justify-center ${styles.iconBg}`}>
            <Ionicons name="warning-outline" size={24} color={styles.iconColor} />
          </View>
          <View className="gap-0.5">
            <Text className="text-[12px] font-sans text-grey-500">
              {t('nuraAI.urgencyLevel')}
            </Text>
            <Text className="text-[18px] font-bold font-sans text-grey-900">
              {t(`nuraAI.severity.${result.severity}`)}
            </Text>
          </View>
        </View>

        <View className={`px-3 py-1 rounded-full ${styles.badgeBg}`}>
          <Text className={`text-[12px] font-semibold font-sans ${styles.badgeText}`}>
            {t(`nuraAI.severity.${result.severity}`)}
          </Text>
        </View>
      </View>

      {/* Assessment Summary */}
      <View className="bg-white border border-grey-100 rounded-2xl p-4 gap-2">
        <Text className="text-[16px] font-bold font-sans text-grey-900">
          {t('nuraAI.assessmentSummary')}
        </Text>
        <Text className="text-[14px] font-sans text-grey-600 leading-5">{result.summary}</Text>
      </View>

      {/* Recommended Next Steps */}
      <View className="bg-white border border-grey-100 rounded-2xl p-4 gap-4">
        <Text className="text-[16px] font-bold font-sans text-grey-900">
          {t('nuraAI.recommendedSteps')}
        </Text>
        <View className="gap-4">
          {result.nextSteps.map((step, i) => (
            <View key={i} className="flex-row gap-3 items-start">
              <View className="w-8 h-8 rounded-full bg-primary-500 items-center justify-center shrink-0">
                <Text className="text-[13px] font-bold font-sans text-white">{i + 1}</Text>
              </View>
              <View className="flex-1 gap-0.5">
                <Text className="text-[14px] font-semibold font-sans text-grey-900">
                  {step.title}
                </Text>
                <Text className="text-[13px] font-sans text-grey-500 leading-5">
                  {step.description}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* Alert banner */}
      <View className="border border-yellow-400 bg-yellow-50 rounded-xl p-3">
        <Text className="text-[13px] font-sans text-grey-700 leading-5">
          {isEmergencyAlert ? t('nuraAI.alertEmergency') : t('nuraAI.alertWishlist')}
        </Text>
      </View>
    </View>
  );
}
