import { useRouter } from 'expo-router';
import { DonorPaymentMethodView } from '@features/donor/screens/DonorPaymentMethodView';

export default function DonorDonatePaymentScreen() {
  const router = useRouter();
  return (
    <DonorPaymentMethodView
      onBack={() => router.back()}
      onDonate={() => router.push('/(donor)/donate-review')}
      onAddCard={() => router.push('/(donor)/donate-add-card')}
    />
  );
}
