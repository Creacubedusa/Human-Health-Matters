import { useRouter } from 'expo-router';
import { DonorFrequencyView } from '@features/donor/screens/DonorFrequencyView';

export default function DonorProfileFrequencyScreen() {
  const router = useRouter();
  return (
    <DonorFrequencyView
      onBack={() => router.back()}
      onSave={() => router.back()}
    />
  );
}
