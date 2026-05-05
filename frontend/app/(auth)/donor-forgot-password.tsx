import { useRouter } from 'expo-router';
import { DonorForgotPasswordView } from '@features/donor/screens/DonorForgotPasswordView';

export default function DonorForgotPasswordScreen() {
  const router = useRouter();
  return (
    <DonorForgotPasswordView
      onSuccess={() => router.push('/(auth)/donor-reset-verify')}
      onBack={() => router.back()}
    />
  );
}
