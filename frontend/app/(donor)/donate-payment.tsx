import { useRouter } from 'expo-router';
import { DonorPaymentMethodView } from '@features/donor/screens/DonorPaymentMethodView';
import { goBackOrReplace } from '@shared/navigation/goBackOrReplace';

export default function DonorDonatePaymentScreen() {
  const router = useRouter();
  return (
    <DonorPaymentMethodView
      onBack={() => goBackOrReplace(router, '/(donor)/donate')}
      onDonate={() => router.push('/(donor)/donate-review')}
      onAddCard={() => router.push('/(donor)/donate-add-card')}
    />
  );
}
