import { useRouter } from 'expo-router';
import { DonorDonationAmountView } from '@features/donor/screens/DonorDonationAmountView';
import { goBackOrReplace } from '@shared/navigation/goBackOrReplace';

export default function DonorDonateScreen() {
  const router = useRouter();
  return (
    <DonorDonationAmountView
      onBack={() => goBackOrReplace(router, '/(donor)')}
      onDonate={() => router.push('/(donor)/donate-payment')}
    />
  );
}
