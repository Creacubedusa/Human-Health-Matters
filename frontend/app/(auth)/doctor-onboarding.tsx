import { useRouter } from 'expo-router';
import { DoctorOnboardingView } from '@features/doctor/screens/DoctorOnboardingView';

export default function DoctorOnboardingScreen() {
  const router = useRouter();
  return (
    <DoctorOnboardingView onGetStarted={() => router.push('/(auth)/doctor-signup')} />
  );
}

