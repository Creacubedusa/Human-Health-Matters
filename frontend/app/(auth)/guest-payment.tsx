import { useRouter } from 'expo-router';
import { DonorAddPaymentMethodView } from '@features/donor/screens/DonorAddPaymentMethodView';

export default function GuestPaymentScreen() {
  const router = useRouter();
  return (
    <DonorAddPaymentMethodView
      onBack={() => router.back()}
      onCard={() => router.push('/(auth)/guest-add-card')}
      onBank={() => router.back()}
    />
  );
}
