import { useRouter } from 'expo-router';
import { PatientForgotPasswordView } from '@features/patient/screens/PatientForgotPasswordView';

export default function PatientForgotPasswordScreen() {
  const router = useRouter();
  return (
    <PatientForgotPasswordView
      onSuccess={() => router.push('/(auth)/patient-reset-verify')}
      onBack={() => router.back()}
    />
  );
}
