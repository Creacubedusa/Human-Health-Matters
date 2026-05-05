import { useLocalSearchParams } from 'expo-router';
import { DoctorEarningReceiptView } from '@features/doctor/screens/DoctorEarningReceiptView';
import { useDoctorEarnings } from '@features/doctor/hooks/useDoctorEarnings';

export default function DoctorEarningReceiptScreen() {
  const { transactionId } = useLocalSearchParams<{ transactionId: string }>();
  const { selectedTransaction, transactions } = useDoctorEarnings();

  const transaction =
    selectedTransaction?.id === transactionId
      ? selectedTransaction
      : transactions.find((item) => item.id === transactionId) ?? null;

  return <DoctorEarningReceiptView transaction={transaction} />;
}
