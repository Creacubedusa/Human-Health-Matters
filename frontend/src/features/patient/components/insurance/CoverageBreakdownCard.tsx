import { Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

interface CoverageBreakdownCardProps {
  consultationCost: number;
  insuranceLineLabel: string;
  insurancePays: number;
  patientCopay: number;
  donorCovers: number;
  finalYouPay: number;
}

interface BreakdownRowProps {
  label: string;
  value: string;
  struckThrough?: boolean;
}

function BreakdownRow({ label, value, struckThrough = false }: BreakdownRowProps) {
  return (
    <View className="flex-row items-center justify-between">
      <Text className="text-b4 font-medium font-sans text-grey-500">
        {label}
      </Text>
      <Text className={['text-b2 font-semibold font-sans text-grey-900', struckThrough ? 'line-through' : ''].join(' ')}>
        {value}
      </Text>
    </View>
  );
}

export function CoverageBreakdownCard({
  consultationCost,
  insuranceLineLabel,
  insurancePays,
  patientCopay,
  donorCovers,
  finalYouPay,
}: CoverageBreakdownCardProps) {
  const { t } = useTranslation();

  return (
    <View className="gap-6 rounded-[16px] bg-grey-50 px-5 py-4">
      <Text className="text-s1 font-semibold font-sans text-grey-900">
        {t('insuranceCoverage.results.coverageBreakdownTitle')}
      </Text>

      <View className="gap-4">
        <BreakdownRow label={t('insuranceCoverage.results.consultationLabel')} value={`$${consultationCost.toFixed(0)}`} />
        <BreakdownRow label={insuranceLineLabel} value={`-$${insurancePays.toFixed(0)}`} />
        <BreakdownRow
          label={t('insuranceCoverage.results.standardCopayLabel')}
          value={`$${patientCopay.toFixed(0)}`}
          struckThrough={donorCovers > 0}
        />
        <BreakdownRow label={t('insuranceCoverage.results.donorCoversLabel')} value={`-$${donorCovers.toFixed(0)}`} />

        <View className="border-t border-grey-300 pt-3">
          <View className="flex-row items-start justify-between">
            <Text className="text-b2 font-medium font-sans text-grey-900">
              {t('insuranceCoverage.results.youPayLabel')}
            </Text>
            <Text className="text-s1 font-semibold font-sans text-grey-900">
              ${finalYouPay.toFixed(0)}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}
