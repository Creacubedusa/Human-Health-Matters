import { useRouter } from 'expo-router';
import { PatientSetPasswordView } from '@features/patient/screens/PatientSetPasswordView';

export default function DonorSetPasswordScreen() {
  const router = useRouter();
  return (
    <PatientSetPasswordView
      onSuccess={() => router.replace('/(auth)/donor-login')}
    />
  );
}
