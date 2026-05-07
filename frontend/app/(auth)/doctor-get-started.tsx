import { useRouter } from 'expo-router';
import { DoctorGetStartedView } from '@features/doctor/screens/DoctorGetStartedView';

export default function DoctorGetStartedScreen() {
  const router = useRouter();

  return (
    <DoctorGetStartedView
      onSignUp={() => router.push('/(auth)/doctor-onboarding')}
      onLogin={() => router.push('/doctor-login')}
    />
  );
}
