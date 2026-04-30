import { useRouter } from 'expo-router';
import { PatientLoginView } from '@features/patient/screens/PatientLoginView';
import { useAuthStore } from '@shared/store/auth.store';

export default function PatientLoginScreen() {
  const router = useRouter();
  return (
    <PatientLoginView
      onSuccess={() => {
        const role = useAuthStore.getState().role;
        if (role === 'doctor') router.replace('/(doctor)');
        else if (role === 'donor') router.replace('/(donor)');
        else router.replace('/(patient)');
      }}
      onForgotPassword={() => router.push('/(auth)/patient-forgot-password')}
      onSignUp={() => router.push('/(auth)/patient-onboarding')}
    />
  );
}
