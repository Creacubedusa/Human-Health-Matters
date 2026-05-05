import { useRouter } from 'expo-router';
import { PatientResetVerifyView } from '@features/patient/screens/PatientResetVerifyView';

export default function DonorResetVerifyScreen() {
  const router = useRouter();
  return (
    <PatientResetVerifyView
      onSuccess={() => router.push('/(auth)/donor-set-password')}
    />
  );
}
