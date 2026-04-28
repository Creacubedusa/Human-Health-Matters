import { useRouter } from 'expo-router';
import { PatientLoginView } from '@features/patient/screens/PatientLoginView';

export default function PatientLoginScreen() {
  const router = useRouter();
  return (
    <PatientLoginView
      onSuccess={() => router.replace('/(patient)')}
      onForgotPassword={() => router.push('/(auth)/patient-forgot-password')}
      onSignUp={() => router.push('/(auth)/patient-onboarding')}
    />
  );
}
