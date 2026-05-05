import { useRouter } from 'expo-router';
import { DonorGuestAmountView } from '@features/donor/screens/DonorGuestAmountView';

export default function GuestDonateScreen() {
  const router = useRouter();
  return (
    <DonorGuestAmountView
      onBack={() => router.back()}
      onDonate={() => router.push('/(auth)/guest-payment')}
    />
  );
}
