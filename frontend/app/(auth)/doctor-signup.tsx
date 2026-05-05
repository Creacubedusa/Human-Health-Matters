import { useRouter } from 'expo-router';
import { DoctorSignUpView } from '@features/doctor/screens/DoctorSignUpView';

export default function DoctorSignUpScreen() {
  const router = useRouter();
  return (
    <DoctorSignUpView
      onSuccess={() => router.push('/(auth)/doctor-verify')}
      onSignIn={() => router.push('/doctor-login')}
    />
  );
}
