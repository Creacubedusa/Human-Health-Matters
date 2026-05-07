import { useLocalSearchParams, useRouter } from 'expo-router';
import { DonorEditCardView } from '@features/donor/screens/DonorEditCardView';
import { goBackOrReplace } from '@shared/navigation/goBackOrReplace';

export default function DonorProfileEditCardScreen() {
  const router = useRouter();
  const { cardId } = useLocalSearchParams<{ cardId: string }>();
  return (
    <DonorEditCardView
      cardId={cardId ?? ''}
      onBack={() => goBackOrReplace(router, '/(donor)/profile')}
      onSave={() => goBackOrReplace(router, '/(donor)/profile')}
    />
  );
}
