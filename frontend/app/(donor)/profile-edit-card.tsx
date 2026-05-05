import { useLocalSearchParams, useRouter } from 'expo-router';
import { DonorEditCardView } from '@features/donor/screens/DonorEditCardView';

export default function DonorProfileEditCardScreen() {
  const router = useRouter();
  const { cardId } = useLocalSearchParams<{ cardId: string }>();
  return (
    <DonorEditCardView
      cardId={cardId ?? ''}
      onBack={() => router.back()}
      onSave={() => router.back()}
    />
  );
}
