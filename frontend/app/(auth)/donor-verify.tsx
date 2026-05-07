import { useRouter } from 'expo-router';
import { DonorVerifyView } from '@features/donor/screens/DonorVerifyView';

export default function DonorVerifyScreen() {
  const router = useRouter();
  return (
    <DonorVerifyView
      onSuccess={() => router.replace('/(donor)/')}
    />
  );
}
