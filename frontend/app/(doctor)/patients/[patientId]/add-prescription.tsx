import { useLocalSearchParams } from 'expo-router';
import { DoctorAddPrescriptionView } from '@features/doctor/screens/DoctorAddPrescriptionView';

export default function DoctorAddPrescriptionScreen() {
  const params = useLocalSearchParams<{ patientId?: string; returnTo?: string }>();

  return (
    <DoctorAddPrescriptionView
      patientId={params.patientId ?? ''}
      returnTo={params.returnTo}
    />
  );
}
