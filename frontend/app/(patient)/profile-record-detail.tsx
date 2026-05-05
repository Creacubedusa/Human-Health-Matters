import { useLocalSearchParams, useRouter } from 'expo-router';
import { MedicationView } from '@features/patient/screens/MedicationView';
import { PatientHistoryView } from '@features/patient/screens/PatientHistoryView';
import { ProfileRecordDetailView } from '@features/patient/screens/ProfileRecordDetailView';
import type { ProfileRecordId } from '@features/patient/types/profileOverview.types';

export default function ProfileRecordDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();

  function handleBack() {
    if (router.canGoBack()) {
      router.back();
      return;
    }

    router.replace('/(patient)/profile');
  }

  const recordId = (id ?? 'patient-history') as ProfileRecordId | 'support-report';

  if (recordId === 'patient-history') {
    return <PatientHistoryView onBack={handleBack} />;
  }

  if (recordId === 'medication') {
    return <MedicationView onBack={handleBack} />;
  }

  return <ProfileRecordDetailView recordId={recordId} onBack={handleBack} />;
}
