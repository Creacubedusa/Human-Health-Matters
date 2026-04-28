import { Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

interface OutOfPocketCardProps {
  balance: number;
  donorAvailableAmount: number;
  coveragePercent: 0 | 25 | 50 | 75 | 100;
}

const PROGRESS_WIDTH_CLASS: Record<OutOfPocketCardProps['coveragePercent'], string> = {
  0: 'w-0',
  25: 'w-1/4',
  50: 'w-1/2',
  75: 'w-3/4',
  100: 'w-full',
};

export function OutOfPocketCard({
  balance,
  donorAvailableAmount,
  coveragePercent,
}: OutOfPocketCardProps) {
  const { t } = useTranslation();

  return (
    <View className="gap-4 rounded-[16px] bg-primary-50 px-5 py-[21px]">
      <View className="gap-2">
        <Text className="text-[12px] leading-4 font-sans text-grey-500">
          {t('insuranceCoverage.results.outOfPocketLabel')}
        </Text>
        <Text className="text-h3 font-semibold font-sans text-grey-900">
          ${balance.toFixed(2)}
        </Text>
      </View>

      <View className="gap-2">
        <View className="flex-row items-center gap-4">
          <View className="h-[13px] flex-1 overflow-hidden rounded-xs bg-white">
            <View className={['h-full rounded-xs bg-primary-500', PROGRESS_WIDTH_CLASS[coveragePercent]].join(' ')} />
          </View>
          <Text className="text-b3 font-sans text-grey-900">
            {coveragePercent}%
          </Text>
        </View>

        <Text className="text-b4 font-medium font-sans text-grey-900">
          {t('insuranceCoverage.results.availableFromDonors', {
            amount: donorAvailableAmount.toFixed(2),
          })}
        </Text>
      </View>
    </View>
  );
}
