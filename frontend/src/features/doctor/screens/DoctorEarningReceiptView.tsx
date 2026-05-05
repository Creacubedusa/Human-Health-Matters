import { ScrollView, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import { primitiveColors } from '@design/tokens';
import { ProfileHeader } from '@features/patient/components/profile/ProfileHeader';
import { ReviewCard } from '@shared/components/ui/ReviewCard';
import type { DoctorEarningTransaction } from '../types/doctorEarnings.types';

export interface DoctorEarningReceiptViewProps {
  transaction: DoctorEarningTransaction | null;
}

const DASH = '—';

export function DoctorEarningReceiptView({
  transaction,
}: DoctorEarningReceiptViewProps) {
  const { t } = useTranslation();
  const router = useRouter();

  const rows = [
    { label: t('doctorEarnings.receiptReferenceLabel'), value: transaction?.receiptReference ?? DASH },
    { label: t('doctorEarnings.receiptAmountLabel'), value: `$${transaction?.amount ?? '0'}` },
    { label: t('doctorEarnings.receiptBankLabel'), value: transaction?.receiptBankDisplay ?? DASH },
    { label: t('doctorEarnings.receiptTimeLabel'), value: transaction?.receiptTime ?? DASH },
    { label: t('doctorEarnings.receiptDateLabel'), value: transaction?.receiptDate ?? DASH },
  ];

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      <ProfileHeader
        title={t('doctorEarnings.receiptTitle')}
        backLabel={t('common.back')}
        onBack={() => router.back()}
      />

      <ScrollView
        className="flex-1"
        contentContainerClassName="px-4 pt-14 pb-10 gap-8"
        showsVerticalScrollIndicator={false}
      >
        <View className="items-center gap-12">
          <Ionicons name="checkmark-circle-outline" size={64} color={primitiveColors['green-500']} />

          <View className="items-center gap-2 w-full">
            <Text className="text-h4 font-semibold font-sans text-grey-900 text-center">
              {t('doctorEarnings.receiptSuccessTitle')}
            </Text>
            <Text className="text-b1 font-sans text-grey-500 text-center">
              {t('doctorEarnings.receiptSuccessMessage', {
                amount: `$${transaction?.amount ?? '0'}`,
                bank: transaction?.receiptBankDisplay ?? t('doctorEarnings.receiptBankFallback'),
              })}
            </Text>
          </View>
        </View>

        <ReviewCard
          title={t('doctorEarnings.receiptDetailsTitle')}
          rows={rows}
        />
      </ScrollView>
    </SafeAreaView>
  );
}
