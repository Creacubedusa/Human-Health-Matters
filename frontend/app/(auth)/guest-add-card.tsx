import { useRouter } from 'expo-router';
import { DonorGuestAddCardView } from '@features/donor/screens/DonorGuestAddCardView';

export default function GuestAddCardScreen() {
  const router = useRouter();
  return (
    <DonorGuestAddCardView
      onBack={() => router.back()}
      onAdd={() => router.push('/(auth)/guest-review')}
    />
  );
}
