import { useRouter } from 'expo-router';
import { DonorOnboardingView } from '@features/donor/screens/DonorOnboardingView';

export default function DonorOnboardingScreen() {
  const router = useRouter();

  return <DonorOnboardingView onGetStarted={() => router.push('/(auth)/donor-signup')} />;
}
