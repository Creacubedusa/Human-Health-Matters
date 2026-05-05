import { ScrollView, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ProfileHeader } from '@features/patient/components/profile/ProfileHeader';
import { PrescriptionFilterTabs } from '@features/patient/components/prescription/PrescriptionFilterTabs';
import { useDoctorEarnings } from '../hooks/useDoctorEarnings';
import { EarningTransactionCard } from '../components/earnings/EarningTransactionCard';

export function DoctorClaimsTrackerView() {
  const { t } = useTranslation();
  const router = useRouter();
  const {
    selectedFilter,
    filteredTransactions,
    setSelectedFilter,
    setSelectedTransaction,
  } = useDoctorEarnings();

  const options = [
    { label: t('doctorEarnings.filters.all'), value: 'all' as const },
    { label: t('doctorEarnings.filters.pending'), value: 'pending' as const },
    { label: t('doctorEarnings.filters.processing'), value: 'processing' as const },
  ];

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      <ProfileHeader
        title={t('doctorEarnings.claimsTracker')}
        backLabel={t('common.back')}
        onBack={() => router.back()}
      />

      <ScrollView
        className="flex-1"
        contentContainerClassName="px-4 pt-6 pb-10 gap-4"
        showsVerticalScrollIndicator={false}
      >
        <Text className="text-b3 font-sans text-grey-500">
          {t('doctorEarnings.claimsTrackerSubtitle')}
        </Text>

        <PrescriptionFilterTabs
          options={options}
          activeValue={selectedFilter === 'paid' ? 'all' : selectedFilter}
          onChange={setSelectedFilter}
        />

        {filteredTransactions
          .filter((transaction) => transaction.status !== 'paid')
          .map((transaction) => (
            <EarningTransactionCard
              key={transaction.id}
              transaction={transaction}
              onPress={() => {
                setSelectedTransaction(transaction);
                router.push(`/(doctor)/earning-transaction/${transaction.id}`);
              }}
            />
          ))}
      </ScrollView>
    </SafeAreaView>
  );
}
