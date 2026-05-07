import { useRouter } from 'expo-router';
import { DoctorForgotPasswordView } from '@features/doctor/screens/DoctorForgotPasswordView';

export default function DoctorForgotPasswordScreen() {
  const router = useRouter();

  return (
    <DoctorForgotPasswordView
      onSuccess={() => router.push('/doctor-reset-verify')}
    />
  );
}
