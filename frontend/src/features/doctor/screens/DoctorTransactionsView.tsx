import { useMemo, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import { primitiveColors } from '@design/tokens';
import { ProfileHeader } from '@features/patient/components/profile/ProfileHeader';
import { PrescriptionFilterTabs } from '@features/patient/components/prescription/PrescriptionFilterTabs';
import { Input } from '@shared/components/ui/Input';
import { useDoctorEarnings } from '../hooks/useDoctorEarnings';
import type { DoctorEarningTransaction } from '../types/doctorEarnings.types';
import { EarningTransactionCard } from '../components/earnings/EarningTransactionCard';

type TransactionScreenFilter = 'all' | 'paid' | 'processing';

function formatDateLabel(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString('en-US', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export function DoctorTransactionsView() {
  const { t } = useTranslation();
  const router = useRouter();
  const { transactions, setSelectedTransaction } = useDoctorEarnings();
  const [activeFilter, setActiveFilter] = useState<TransactionScreenFilter>('paid');
  const [fromDate] = useState('2025-08-12T00:00:00.000Z');
  const [toDate] = useState('2026-08-12T00:00:00.000Z');

  const options = [
    { label: t('doctorEarnings.filters.all'), value: 'all' as const },
    { label: t('doctorEarnings.filters.paid'), value: 'paid' as const },
    { label: t('doctorEarnings.filters.processing'), value: 'processing' as const },
  ];

  const filteredTransactions = useMemo(() => {
    const normalized = transactions.filter((transaction) => {
      if (activeFilter === 'all') return true;
      return transaction.status === activeFilter;
    });

    const fromTime = new Date(fromDate).getTime();
    const toTime = new Date(toDate).getTime();

    return normalized.filter((transaction) => {
      const transactionTime = new Date(transaction.date).getTime();
      if (Number.isNaN(transactionTime)) return true;
      return transactionTime >= fromTime && transactionTime <= toTime;
    });
  }, [activeFilter, fromDate, toDate, transactions]);

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      <ProfileHeader
        title={t('doctorEarnings.transactionsTitle')}
        backLabel={t('common.back')}
        onBack={() => router.back()}
      />

      <ScrollView
        className="flex-1"
        contentContainerClassName="px-4 pt-8 pb-10 gap-6"
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-row justify-between gap-4">
          <View className="flex-1">
            <Input
              label={t('doctorEarnings.fromLabel')}
              value={formatDateLabel(fromDate)}
              editable={false}
              iconRight={<Ionicons name="calendar-outline" size={20} color={primitiveColors['grey-400']} />}
            />
          </View>
          <View className="flex-1">
            <Input
              label={t('doctorEarnings.toLabel')}
              value={formatDateLabel(toDate)}
              editable={false}
              iconRight={<Ionicons name="calendar-outline" size={20} color={primitiveColors['grey-400']} />}
            />
          </View>
        </View>

        <PrescriptionFilterTabs
          options={options}
          activeValue={activeFilter}
          onChange={(value) => setActiveFilter(value as TransactionScreenFilter)}
        />

        <View className="gap-4">
          {filteredTransactions.map((transaction: DoctorEarningTransaction) => (
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
