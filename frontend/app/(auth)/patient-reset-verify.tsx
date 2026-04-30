import { useRouter } from 'expo-router';
import { PatientResetVerifyView } from '@features/patient/screens/PatientResetVerifyView';

export default function PatientResetVerifyScreen() {
  const router = useRouter();
  return (
    <PatientResetVerifyView
      onSuccess={() => router.push('/(auth)/patient-set-password')}
    />
  );
}
