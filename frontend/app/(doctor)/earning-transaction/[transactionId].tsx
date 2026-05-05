import { useLocalSearchParams } from 'expo-router';
import { DoctorEarningTransactionDetailView } from '@features/doctor/screens/DoctorEarningTransactionDetailView';
import { useDoctorEarnings } from '@features/doctor/hooks/useDoctorEarnings';

export default function DoctorEarningTransactionDetailScreen() {
  const { transactionId } = useLocalSearchParams<{ transactionId: string }>();
  const { selectedTransaction, transactions } = useDoctorEarnings();

  const transaction =
    selectedTransaction?.id === transactionId
      ? selectedTransaction
      : transactions.find((item) => item.id === transactionId) ?? null;

  return <DoctorEarningTransactionDetailView transaction={transaction} />;
}
