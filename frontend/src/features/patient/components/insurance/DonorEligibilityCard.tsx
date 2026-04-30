import { Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import type { EligibilityStatus } from '@features/patient/types/insuranceCoverage.types';

interface DonorEligibilityCardProps {
  patientName: string;
  householdSize: string;
  householdIncome: string;
  supportStatus: EligibilityStatus;
  supportAmount: number;
}

const BADGE_CONTAINER_CLASS: Record<EligibilityStatus, string> = {
  unknown: 'bg-grey-100',
  eligible: 'bg-green-50',
  ineligible: 'bg-red-50',
  inconclusive: 'bg-yellow-50',
};

const BADGE_TEXT_CLASS: Record<EligibilityStatus, string> = {
  unknown: 'text-grey-500',
  eligible: 'text-green-500',
  ineligible: 'text-red-500',
  inconclusive: 'text-yellow-500',
};

interface SummaryItemProps {
  label: string;
  value: string;
}

function SummaryItem({ label, value }: SummaryItemProps) {
  return (
    <View className="gap-1">
      <Text className="text-[12px] leading-4 font-sans text-grey-500">
        {label}
      </Text>
      <Text className="text-b2 font-medium font-sans text-grey-900">
        {value}
      </Text>
    </View>
  );
}

export function DonorEligibilityCard({
  patientName,
  householdSize,
  householdIncome,
  supportStatus,
  supportAmount,
}: DonorEligibilityCardProps) {
  const { t } = useTranslation();

  return (
    <View className="gap-6 rounded-lg border border-grey-300 bg-white px-5 py-4">
      <View className="flex-row items-start justify-between gap-4">
        <View className="flex-1 gap-1">
          <Text className="text-[12px] font-medium font-sans uppercase leading-4 text-grey-500">
            {t('insuranceCoverage.results.donorSupportLabel')}
          </Text>
          <Text className="text-s2 font-semibold font-sans text-grey-900">
            {patientName}
          </Text>
          <Text className="text-[12px] font-sans leading-4 text-grey-500">
            {t('insuranceCoverage.results.donorSupportSubtitle')}
          </Text>
        </View>

        <View className={['rounded-xs px-3 py-1.5', BADGE_CONTAINER_CLASS[supportStatus]].join(' ')}>
          <Text className={['text-[10px] leading-3 font-semibold font-sans', BADGE_TEXT_CLASS[supportStatus]].join(' ')}>
            {t(`insuranceCoverage.results.eligibility.${supportStatus}`)}
          </Text>
        </View>
      </View>

      <View className="flex-row items-center justify-between">
        <SummaryItem label={t('insuranceCoverage.noInsurance.householdSizeLabel')} value={householdSize || t('insuranceCoverage.results.notAvailable')} />
        <SummaryItem label={t('insuranceCoverage.results.incomeLabel')} value={householdIncome || t('insuranceCoverage.results.notAvailable')} />
        <SummaryItem label={t('insuranceCoverage.results.supportLabel')} value={`$${supportAmount.toFixed(0)}`} />
      </View>
    </View>
  );
}
