import { useLocalSearchParams } from 'expo-router';
import { DoctorPatientProfileView } from '@features/doctor/screens/DoctorPatientProfileView';

export default function DoctorPatientProfileScreen() {
  const params = useLocalSearchParams<{ patientId?: string }>();

  return <DoctorPatientProfileView patientId={params.patientId ?? ''} />;
}
