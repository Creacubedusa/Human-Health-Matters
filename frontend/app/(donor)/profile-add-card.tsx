import { useRouter } from 'expo-router';
import { DonorAddCardView } from '@features/donor/screens/DonorAddCardView';
import { goBackOrReplace } from '@shared/navigation/goBackOrReplace';

export default function DonorProfileAddCardScreen() {
  const router = useRouter();
  return (
    <DonorAddCardView
      onBack={() => goBackOrReplace(router, '/(donor)/profile-add-method')}
      onAdd={() => router.replace('/(donor)/profile')}
    />
  );
}
