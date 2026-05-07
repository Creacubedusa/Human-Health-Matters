import { ScrollView, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Badge } from '@shared/components/ui/Badge';
import { ProfileHeader } from '@features/patient/components/profile/ProfileHeader';
import type { DoctorEarningTransaction } from '../types/doctorEarnings.types';

export interface DoctorEarningTransactionDetailViewProps {
  transaction: DoctorEarningTransaction | null;
}

const DASH = '—';

function getStatusBadgeStatus(status: DoctorEarningTransaction['status']) {
  if (status === 'paid') return 'success';
  if (status === 'pending') return 'warning';
  return 'info';
}

function getStatusLabel(status: DoctorEarningTransaction['status']) {
  return status.charAt(0).toUpperCase() + status.slice(1);
}

function getSourceLabel(source: DoctorEarningTransaction['source'], t: (key: string) => string) {
  return source === 'donor'
    ? t('doctorEarnings.sourceDonorFund')
    : t('doctorEarnings.sourceInsuranceClaim');
}

export function DoctorEarningTransactionDetailView({
  transaction,
}: DoctorEarningTransactionDetailViewProps) {
  const { t } = useTranslation();
  const router = useRouter();

  const consultationRows = [
    { label: t('doctorEarnings.consultationPatient'), value: transaction?.patientName ?? DASH },
    { label: t('doctorEarnings.consultationChiefComplaint'), value: transaction?.description ?? DASH },
    { label: t('doctorEarnings.consultationDate'), value: transaction?.consultationDate ?? transaction?.date ?? DASH },
    { label: t('doctorEarnings.consultationTime'), value: transaction?.consultationTime ?? DASH },
    { label: t('doctorEarnings.consultationDuration'), value: transaction?.consultationDuration ?? DASH },
  ];

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      <ProfileHeader
        title={t('doctorEarnings.transactionDetailsTitle')}
        backLabel={t('common.back')}
        onBack={() => router.back()}
      />

      <ScrollView
        className="flex-1"
        contentContainerClassName="px-4 pt-14 pb-10 gap-10"
        showsVerticalScrollIndicator={false}
      >
        <View className="items-center gap-4">
          <Badge
            label={getSourceLabel(transaction?.source ?? 'donor', t)}
            status="info"
            variant="outline"
            size="small"
          />

          <Text className="text-h3 font-semibold font-sans text-grey-900 text-center">
            {`$${transaction?.amount.toFixed(2) ?? '0.00'}`}
          </Text>

          <View className="flex-row items-center gap-3">
            <Badge
              label={transaction ? getStatusLabel(transaction.status) : t('doctorEarnings.filters.all')}
              status={transaction ? getStatusBadgeStatus(transaction.status) : 'default'}
              variant="outline"
              size="tiny"
            />
            <Text className="text-c1 font-sans text-grey-500">
              {transaction?.transactionCode ?? DASH}
            </Text>
          </View>
        </View>

        <View className="rounded-2xl bg-grey-50 px-5 py-4">
          <View className="gap-6">
            <Text className="text-s1 font-semibold font-sans text-grey-900">
              {transaction?.consultationTitle ?? t('doctorEarnings.consultationTitle')}
            </Text>

            <View className="gap-4">
              {consultationRows.map((row) => (
                <View key={row.label} className="flex-row items-center justify-between gap-4">
                  <Text className="flex-1 text-b3 font-medium font-sans text-grey-500">
                    {row.label}
                  </Text>
                  <Text className="flex-1 text-right text-s2 font-semibold font-sans text-grey-900">
                    {row.value}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
