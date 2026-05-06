import { useRouter } from 'expo-router';
import { DoctorAvailabilityView } from '@features/doctor/screens/DoctorAvailabilityView';
import { goBackOrReplace } from '@shared/navigation/goBackOrReplace';

export default function DoctorAvailabilityScreen() {
  const router = useRouter();

  function handleBack() {
    goBackOrReplace(router, '/(doctor)/calendar');
  }

  return <DoctorAvailabilityView onBack={handleBack} />;
}
