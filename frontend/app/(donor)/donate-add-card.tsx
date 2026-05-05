import { useRouter } from 'expo-router';
import { DonorAddCardView } from '@features/donor/screens/DonorAddCardView';

export default function DonorDonateAddCardScreen() {
  const router = useRouter();
  return (
    <DonorAddCardView
      onBack={() => router.back()}
      onAdd={() => router.back()}
    />
  );
}
