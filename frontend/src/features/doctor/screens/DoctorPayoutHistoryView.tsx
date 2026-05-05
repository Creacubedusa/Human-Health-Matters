import { ScrollView, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ProfileHeader } from '@features/patient/components/profile/ProfileHeader';
import { useDoctorEarnings } from '../hooks/useDoctorEarnings';
import { EarningPayoutCard } from '../components/earnings/EarningPayoutCard';

export function DoctorPayoutHistoryView() {
  const { t } = useTranslation();
  const router = useRouter();
  const {
    payoutTransactions,
    dateRangeLabel,
    setSelectedTransaction,
  } = useDoctorEarnings();

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      <ProfileHeader
        title={t('doctorEarnings.payoutHistory')}
        backLabel={t('common.back')}
        onBack={() => router.back()}
      />

      <ScrollView
        className="flex-1"
        contentContainerClassName="px-4 pt-6 pb-10 gap-6"
        showsVerticalScrollIndicator={false}
      >
        <View className="items-center">
          <Text className="text-btn-medium font-semibold font-sans text-grey-900">
            {dateRangeLabel}
          </Text>
        </View>

        <View className="gap-4">
          {payoutTransactions.map((transaction) => (
            <EarningPayoutCard
              key={transaction.id}
              transaction={transaction}
              onPress={() => {
                setSelectedTransaction(transaction);
                router.push(`/(doctor)/earning-receipt/${transaction.id}`);
              }}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
