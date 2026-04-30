import { useLocalSearchParams, useRouter } from 'expo-router';
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

  return (
    <ProfileRecordDetailView
      recordId={(id ?? 'patient-history') as ProfileRecordId | 'support-report'}
      onBack={handleBack}
    />
  );
}
