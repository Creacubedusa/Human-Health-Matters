import { useRouter } from 'expo-router';
import { DonorDonationAmountView } from '@features/donor/screens/DonorDonationAmountView';

export default function DonorDonateScreen() {
  const router = useRouter();
  return (
    <DonorDonationAmountView
      onBack={() => router.back()}
      onDonate={() => router.push('/(donor)/donate-payment')}
    />
  );
}
