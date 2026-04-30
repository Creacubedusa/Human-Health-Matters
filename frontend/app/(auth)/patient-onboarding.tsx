import { useRouter } from 'expo-router';
import { PatientOnboardingView } from '@features/patient/screens/PatientOnboardingView';
import { kvSet } from '@shared/storage/kv';

export default function PatientOnboardingScreen() {
  const router = useRouter();
  return (
    <PatientOnboardingView
      onGetStarted={() => {
        kvSet('patient_onboarding_seen', '1');
        router.push('/(auth)/patient-signup');
      }}
    />
  );
}
