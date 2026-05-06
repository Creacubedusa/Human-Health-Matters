import { useRouter } from 'expo-router';
import { DonorGetStartedView } from '@features/donor/screens/DonorGetStartedView';

export default function DonorGetStartedScreen() {
  const router = useRouter();

  return (
    <DonorGetStartedView
      onSignUp={() => router.push('/(auth)/donor-onboarding')}
      onLogin={() => router.push('/(auth)/donor-login')}
      onGuestDonate={() => router.push('/(auth)/guest-donate')}
    />
  );
}
