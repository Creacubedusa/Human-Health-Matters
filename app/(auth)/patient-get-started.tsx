import { useRouter } from 'expo-router';
import { PatientGetStartedView } from '@features/patient/screens/PatientGetStartedView';

export default function PatientGetStartedScreen() {
  const router = useRouter();

  return (
    <PatientGetStartedView
      onSignUp={() => router.push('/(auth)/patient-onboarding')}
      onLogin={() => router.push('/(auth)/patient-login')}
    />
  );
}
