import { useRouter } from 'expo-router';
import { DonorAddCardView } from '@features/donor/screens/DonorAddCardView';

export default function DonorProfileAddCardScreen() {
  const router = useRouter();
  return (
    <DonorAddCardView
      onBack={() => router.back()}
      onAdd={() => router.replace('/(donor)/profile')}
    />
  );
}
