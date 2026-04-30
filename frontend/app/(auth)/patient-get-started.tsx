import { useRouter } from 'expo-router';
import { PatientGetStartedView } from '@features/patient/screens/PatientGetStartedView';
import { kvGet } from '@shared/storage/kv';

export default function PatientGetStartedScreen() {
  const router = useRouter();

  return (
    <PatientGetStartedView
      onSignUp={() => {
        kvGet('patient_onboarding_seen').then((seen) => {
          if (seen) {
            router.push('/(auth)/patient-signup');
            return;
          }
          router.push('/(auth)/patient-onboarding');
        });
      }}
      onLogin={() => router.push('/(auth)/patient-login')}
    />
  );
}
