import { useRouter } from 'expo-router';
import { DonorLoginView } from '@features/donor/screens/DonorLoginView';

export default function DonorLoginScreen() {
  const router = useRouter();
  return (
    <DonorLoginView
      onSuccess={() => router.replace('/(donor)/')}
      onForgotPassword={() => router.push('/(auth)/donor-forgot-password')}
      onSignUp={() => router.push('/(auth)/donor-signup')}
    />
  );
}
