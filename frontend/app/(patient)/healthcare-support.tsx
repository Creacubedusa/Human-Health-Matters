import { useRouter } from 'expo-router';
import { HealthcareSupportView } from '@features/patient/screens/HealthcareSupportView';

export default function HealthcareSupportScreen() {
  const router = useRouter();

  function handleBack() {
    router.back();
  }

  return <HealthcareSupportView onBack={handleBack} />;
}
