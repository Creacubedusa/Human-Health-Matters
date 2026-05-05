import { useRouter } from 'expo-router';
import { DonorAddPaymentMethodView } from '@features/donor/screens/DonorAddPaymentMethodView';

export default function DonorProfileAddMethodScreen() {
  const router = useRouter();
  return (
    <DonorAddPaymentMethodView
      onBack={() => router.back()}
      onCard={() => router.push('/(donor)/profile-add-card')}
      onBank={() => router.back()}
    />
  );
}
