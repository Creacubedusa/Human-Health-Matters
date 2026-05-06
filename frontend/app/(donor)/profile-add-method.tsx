import { useRouter } from 'expo-router';
import { DonorAddPaymentMethodView } from '@features/donor/screens/DonorAddPaymentMethodView';
import { goBackOrReplace } from '@shared/navigation/goBackOrReplace';

export default function DonorProfileAddMethodScreen() {
  const router = useRouter();
  return (
    <DonorAddPaymentMethodView
      onBack={() => goBackOrReplace(router, '/(donor)/profile')}
      onCard={() => router.push('/(donor)/profile-add-card')}
      onBank={() => router.back()}
    />
  );
}
