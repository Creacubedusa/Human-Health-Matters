import { useRouter } from 'expo-router';
import { DoctorOnboardingView } from '@features/doctor/screens/DoctorOnboardingView';

export default function DoctorOnboardingScreen() {
  const router = useRouter();
  return (
    <DoctorOnboardingView onComplete={() => router.replace('/(doctor)')} />
  );
}

