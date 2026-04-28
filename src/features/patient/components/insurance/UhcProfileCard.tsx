import { Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import type { InsuranceStatus } from '@features/patient/types/insuranceCoverage.types';

interface UhcProfileCardProps {
  carrierLabel: string;
  patientName: string;
  subtitle: string;
  groupNumber: string;
  planType: string;
  telehealthCoverage: string;
  status: InsuranceStatus;
}

const BADGE_CONTAINER_CLASS: Record<InsuranceStatus, string> = {
  active: 'bg-green-50',
  inactive: 'bg-red-50',
  inconclusive: 'bg-yellow-50',
};

const BADGE_TEXT_CLASS: Record<InsuranceStatus, string> = {
  active: 'text-green-500',
  inactive: 'text-red-500',
  inconclusive: 'text-yellow-500',
};

interface SummaryItemProps {
  label: string;
  value: string;
  centered?: boolean;
}

function SummaryItem({ label, value, centered = false }: SummaryItemProps) {
  return (
    <View className={['gap-1', centered ? 'items-center' : 'items-start'].join(' ')}>
      <Text className="text-[12px] leading-4 font-sans text-grey-500">
        {label}
      </Text>
      <Text className="text-b2 font-medium font-sans text-grey-900">
        {value}
      </Text>
    </View>
  );
}

export function UhcProfileCard({
  carrierLabel,
  patientName,
  subtitle,
  groupNumber,
  planType,
  telehealthCoverage,
  status,
}: UhcProfileCardProps) {
  const { t } = useTranslation();

  return (
    <View className="gap-6 rounded-lg border border-grey-300 bg-white px-5 py-4">
      <View className="flex-row items-start justify-between gap-4">
        <View className="flex-1 gap-1">
          <Text className="text-[12px] font-medium font-sans uppercase leading-4 text-grey-500">
            {carrierLabel}
          </Text>
          <Text className="text-s2 font-semibold font-sans text-grey-900">
            {patientName}
          </Text>
          <Text className="text-[12px] font-sans leading-4 text-grey-500">
            {subtitle}
          </Text>
        </View>

        <View className={['rounded-xs px-3 py-1.5', BADGE_CONTAINER_CLASS[status]].join(' ')}>
          <Text className={['text-[10px] leading-3 font-semibold font-sans', BADGE_TEXT_CLASS[status]].join(' ')}>
            {t(`insuranceCoverage.results.status.${status}`)}
          </Text>
        </View>
      </View>

      <View className="flex-row items-center justify-between">
        <SummaryItem label={t('insuranceCoverage.results.groupLabel')} value={groupNumber} />
        <SummaryItem label={t('insuranceCoverage.benefits.planType')} value={planType} centered />
        <SummaryItem label={t('insuranceCoverage.results.telehealthLabel')} value={telehealthCoverage} centered />
      </View>
    </View>
  );
}
