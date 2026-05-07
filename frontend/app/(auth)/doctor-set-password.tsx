import { useRouter } from 'expo-router';
import { DoctorSetPasswordView } from '@features/doctor/screens/DoctorSetPasswordView';

export default function DoctorSetPasswordScreen() {
  const router = useRouter();

  return (
    <DoctorSetPasswordView
      onSuccess={() => router.replace('/doctor-login')}
    />
  );
}
