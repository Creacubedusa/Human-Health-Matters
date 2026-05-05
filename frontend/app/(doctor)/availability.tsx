import { useRouter } from 'expo-router';
import { DoctorAvailabilityView } from '@features/doctor/screens/DoctorAvailabilityView';

export default function DoctorAvailabilityScreen() {
  const router = useRouter();

  function handleBack() {
    if (router.canGoBack()) {
      router.back();
      return;
    }

    router.replace('/(doctor)/calendar');
  }

  return <DoctorAvailabilityView onBack={handleBack} />;
}
