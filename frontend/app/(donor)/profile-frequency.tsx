import { useRouter } from 'expo-router';
import { DonorFrequencyView } from '@features/donor/screens/DonorFrequencyView';
import { goBackOrReplace } from '@shared/navigation/goBackOrReplace';

export default function DonorProfileFrequencyScreen() {
  const router = useRouter();
  return (
    <DonorFrequencyView
      onBack={() => goBackOrReplace(router, '/(donor)/profile')}
      onSave={() => goBackOrReplace(router, '/(donor)/profile')}
    />
  );
}
