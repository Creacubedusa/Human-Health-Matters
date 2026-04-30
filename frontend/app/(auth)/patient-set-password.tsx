import { useRouter } from 'expo-router';
import { PatientSetPasswordView } from '@features/patient/screens/PatientSetPasswordView';

export default function PatientSetPasswordScreen() {
  const router = useRouter();
  return (
    <PatientSetPasswordView
      onSuccess={() => router.replace('/(auth)/patient-login')}
    />
  );
}
