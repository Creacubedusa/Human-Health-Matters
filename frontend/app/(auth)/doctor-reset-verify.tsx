import { useRouter } from 'expo-router';
import { DoctorResetVerifyView } from '@features/doctor/screens/DoctorResetVerifyView';

export default function DoctorResetVerifyScreen() {
  const router = useRouter();

  return (
    <DoctorResetVerifyView
      onSuccess={() => router.push('/doctor-set-password')}
    />
  );
}
