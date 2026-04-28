import { useRouter } from 'expo-router';
import { PatientOnboardingView } from '@features/patient/screens/PatientOnboardingView';

export default function PatientOnboardingScreen() {
  const router = useRouter();
  return <PatientOnboardingView onGetStarted={() => router.push('/(auth)/patient-signup')} />;
}
