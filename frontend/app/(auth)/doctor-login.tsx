import { useRouter } from 'expo-router';
import { DoctorLoginView } from '@features/doctor/screens/DoctorLoginView';

export default function DoctorLoginScreen() {
  const router = useRouter();

  return (
    <DoctorLoginView
      onSuccess={() => router.replace('/(doctor)')}
      onForgotPassword={() => router.push('/doctor-forgot-password')}
      onSignUp={() => router.push('/(auth)/doctor-onboarding')}
    />
  );
}
