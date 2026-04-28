import { useRouter } from 'expo-router';
import { PatientVerifyView } from '@features/patient/screens/PatientVerifyView';

export default function PatientVerifyScreen() {
  const router = useRouter();
  return (
    <PatientVerifyView
      onSuccess={() => router.push('/(auth)/patient-profile')}
    />
  );
}
