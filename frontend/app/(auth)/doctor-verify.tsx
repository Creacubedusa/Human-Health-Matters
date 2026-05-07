import { useRouter } from 'expo-router';
import { DoctorVerifyView } from '@features/doctor/screens/DoctorVerifyView';

export default function DoctorVerifyScreen() {
  const router = useRouter();
  return (
    <DoctorVerifyView
      onSuccess={() => router.replace('/(auth)/doctor-profile-setup')}
    />
  );
}
