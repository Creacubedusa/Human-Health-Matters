import { useLocalSearchParams } from 'expo-router';
import {
  DoctorPatientRecordDetailView,
  type DoctorRecordDetailId,
} from '@features/doctor/screens/DoctorPatientRecordDetailView';

export default function DoctorPatientRecordDetailScreen() {
  const params = useLocalSearchParams<{ patientId?: string; recordId?: string }>();

  return (
    <DoctorPatientRecordDetailView
      patientId={params.patientId ?? ''}
      recordId={(params.recordId ?? 'patient-history') as DoctorRecordDetailId}
    />
  );
}
