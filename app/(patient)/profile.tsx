import { useRouter } from 'expo-router';
import { PatientProfileOverviewView } from '@features/patient/screens/PatientProfileOverviewView';
import type { ProfileRecordId } from '@features/patient/types/profileOverview.types';

export default function PatientProfileScreen() {
  const router = useRouter();

  function handleBack() {
    if (router.canGoBack()) {
      router.back();
      return;
    }

    router.replace('/(patient)');
  }

  return (
    <PatientProfileOverviewView
      onBack={handleBack}
      onEdit={() => router.push('/(patient)/profile-edit')}
      onCompleteProfile={() => router.push('/(auth)/patient-profile')}
      onLanguage={() => router.push('/(auth)/select-language')}
      onPrivacy={() => router.push('/(patient)/privacy-policy')}
      onRecord={(id: ProfileRecordId | 'support-report') => {
        if (id === 'order') {
          router.push('/(patient)/orders');
          return;
        }
        if (id === 'tests') {
          router.push('/(patient)/tests');
          return;
        }
        router.push({ pathname: '/(patient)/profile-record-detail', params: { id } });
      }}
    />
  );
}
