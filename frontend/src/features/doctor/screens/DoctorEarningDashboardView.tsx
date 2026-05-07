import { ScrollView, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { primitiveColors } from '@design/tokens';
import { ProfileHeader } from '@features/patient/components/profile/ProfileHeader';
import { Button } from '@shared/components/ui/Button';
import { DatePickerField } from '@shared/components/ui/DatePickerField';
import { useDoctorEarnings } from '../hooks/useDoctorEarnings';
import { EarningQuickActionCard } from '../components/earnings/EarningQuickActionCard';
import { EarningTransactionCard } from '../components/earnings/EarningTransactionCard';

function formatCurrency(amount: number) {
  return `$${amount.toFixed(2)}`;
}

export function DoctorEarningDashboardView() {
  const { t } = useTranslation();
  const router = useRouter();
  const {
    totalBalance,
    periodEarnings,
    recentTransactions,
    dateRange,
    setSelectedTransaction,
    setDateRange,
  } = useDoctorEarnings();

  function handleChangeFrom(from: string) {
    const nextTo = new Date(from).getTime() > new Date(dateRange.to).getTime() ? from : dateRange.to;
    setDateRange({ from, to: nextTo });
  }

  function handleChangeTo(to: string) {
    const nextFrom = new Date(to).getTime() < new Date(dateRange.from).getTime() ? to : dateRange.from;
    setDateRange({ from: nextFrom, to });
  }

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      <ProfileHeader
        title={t('doctorEarnings.title')}
        backLabel={t('common.back')}
        onBack={() => router.back()}
      />

      <ScrollView
        className="flex-1"
        contentContainerClassName="px-4 pt-6 pb-10 gap-6"
        showsVerticalScrollIndicator={false}
      >
        <View className="self-center bg-primary-50 rounded-lg px-4 py-1.5">
          <Text className="text-btn-tiny font-semibold font-sans text-primary-500 text-center">
            {t('doctorEarnings.zeroCommission')}
          </Text>
        </View>

        <View className="gap-4">
          <View className="flex-row justify-between gap-4">
            <View className="flex-1">
              <DatePickerField
                label={t('doctorEarnings.fromLabel')}
                value={dateRange.from}
                onChange={handleChangeFrom}
              />
            </View>
            <View className="flex-1">
              <DatePickerField
                label={t('doctorEarnings.toLabel')}
                value={dateRange.to}
                onChange={handleChangeTo}
              />
            </View>
          </View>

          <View className="items-center gap-4 pt-2">
            <Text className="text-b3 font-sans text-grey-500">
              {t('doctorEarnings.totalBalance')}
            </Text>
            <Text className="text-h3 font-semibold font-sans text-grey-900">
              {formatCurrency(totalBalance)}
            </Text>
            <View className="bg-grey-50 rounded-lg px-4 py-1.5">
              <Text className="text-btn-tiny font-semibold font-sans text-grey-500">
                {t('doctorEarnings.periodEarnings', {
                  amount: formatCurrency(periodEarnings),
                })}
              </Text>
            </View>
          </View>
        </View>

        <View className="bg-white gap-4">
          <Text className="text-s2 font-semibold font-sans text-grey-900">
            {t('doctorEarnings.quickActions')}
          </Text>
          <View className="flex-row items-start justify-between px-6">
            <EarningQuickActionCard
              label={t('doctorEarnings.withdraw')}
              icon={
                <View className="bg-blue-500 rounded-2xl size-8 items-center justify-center">
                  <Ionicons name="wallet-outline" size={16} color={primitiveColors.white} />
                </View>
              }
              onPress={() => router.push('/(doctor)/earning-withdraw')}
            />
            <EarningQuickActionCard
              label={t('doctorEarnings.claimsTracker')}
              icon={
                <View className="bg-red-500 rounded-2xl size-8 items-center justify-center">
                  <Ionicons name="time-outline" size={16} color={primitiveColors.white} />
                </View>
              }
              onPress={() => router.push('/(doctor)/earning-claims-tracker')}
            />
            <EarningQuickActionCard
              label={t('doctorEarnings.payoutHistory')}
              icon={
                <View className="bg-green-500 rounded-2xl size-8 items-center justify-center">
                  <MaterialCommunityIcons name="history" size={16} color={primitiveColors.white} />
                </View>
              }
              onPress={() => router.push('/(doctor)/earning-payout-history')}
            />
          </View>
        </View>

        <View className="gap-4">
          <View className="flex-row items-center justify-between">
            <Text className="text-s2 font-semibold font-sans text-grey-900">
              {t('doctorEarnings.transactions')}
            </Text>
            <Button
              label={t('doctorEarnings.seeAll')}
              variant="clear"
              size="small"
              iconRight={<Ionicons name="arrow-forward" size={16} color={primitiveColors['primary-500']} />}
              onPress={() => router.push('/(doctor)/earning-transactions')}
            />
          </View>

          {recentTransactions.map((transaction) => (
            <EarningTransactionCard
              key={transaction.id}
              transaction={transaction}
              onPress={() => {
                setSelectedTransaction(transaction);
                router.push(`/(doctor)/earning-transaction/${transaction.id}`);
              }}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
