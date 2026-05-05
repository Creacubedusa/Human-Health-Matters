import { useRouter } from 'expo-router';
import { PatientVerifyView } from '@features/patient/screens/PatientVerifyView';
import { useAuthStore } from '@shared/store/auth.store';

export default function PatientVerifyScreen() {
  const router = useRouter();
  return (
    <PatientVerifyView
      onSuccess={() => {
        const role = useAuthStore.getState().role;
        if (role === 'doctor') router.push('/(auth)/doctor-profile-setup');
        else router.push('/(auth)/patient-profile');
      }}
    />
  );
}
