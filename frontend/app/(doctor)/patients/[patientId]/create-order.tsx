import { useLocalSearchParams } from 'expo-router';
import { DoctorCreateOrderView } from '@features/doctor/screens/DoctorCreateOrderView';

export default function DoctorCreateOrderScreen() {
  const params = useLocalSearchParams<{ patientId?: string; returnTo?: string }>();

  return (
    <DoctorCreateOrderView
      patientId={params.patientId ?? ''}
      returnTo={params.returnTo}
    />
  );
}
