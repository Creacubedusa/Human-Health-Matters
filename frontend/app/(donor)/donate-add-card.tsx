import { useRouter } from 'expo-router';
import { DonorAddCardView } from '@features/donor/screens/DonorAddCardView';
import { goBackOrReplace } from '@shared/navigation/goBackOrReplace';

export default function DonorDonateAddCardScreen() {
  const router = useRouter();
  return (
    <DonorAddCardView
      onBack={() => goBackOrReplace(router, '/(donor)/donate-payment')}
      onAdd={() => goBackOrReplace(router, '/(donor)/donate-payment')}
    />
  );
}
