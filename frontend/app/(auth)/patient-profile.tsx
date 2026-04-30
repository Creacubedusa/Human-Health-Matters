import { useRouter } from 'expo-router';
import { PatientProfileView } from '@features/patient/screens/PatientProfileView';

export default function PatientProfileScreen() {
  const router = useRouter();
  return (
    <PatientProfileView
      onComplete={() => router.replace('/(patient)')}
    />
  );
}
