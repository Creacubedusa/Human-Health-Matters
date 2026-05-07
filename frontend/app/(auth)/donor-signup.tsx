import { useRouter } from 'expo-router';
import { DonorSignUpView } from '@features/donor/screens/DonorSignUpView';

export default function DonorSignUpScreen() {
  const router = useRouter();
  return (
    <DonorSignUpView
      onSuccess={() => router.push('/(auth)/donor-verify')}
      onSignIn={() => router.push('/(auth)/donor-login')}
    />
  );
}
