import { useRouter } from 'expo-router';
import { PatientSignUpView } from '@features/patient/screens/PatientSignUpView';

export default function PatientSignUpScreen() {
  const router = useRouter();
  return (
    <PatientSignUpView
      onSuccess={() => router.push('/(auth)/patient-verify')}
      onSignIn={() => router.push('/(auth)/patient-login')}
    />
  );
}
