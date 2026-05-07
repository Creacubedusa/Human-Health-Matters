import { useLocalSearchParams } from 'expo-router';
import { DoctorAddDocumentView } from '@features/doctor/screens/DoctorAddDocumentView';

export default function DoctorAddDocumentScreen() {
  const params = useLocalSearchParams<{ patientId?: string }>();

  return <DoctorAddDocumentView patientId={params.patientId ?? ''} />;
}
