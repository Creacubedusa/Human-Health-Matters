import { useRouter } from 'expo-router';
import { PatientProfileOverviewView } from '@features/patient/screens/PatientProfileOverviewView';
import type { ProfileRecordId } from '@features/patient/types/profileOverview.types';

export default function PatientProfileScreen() {
  const router = useRouter();

  function handleBack() {
    router.back();
  }

  return (
    <PatientProfileOverviewView
      onBack={handleBack}
      onEdit={() => router.push('/(patient)/profile-edit')}
      onCompleteProfile={() => router.push('/(auth)/patient-profile')}
      onLanguage={() => router.push('/(auth)/select-language')}
      onPrivacy={() => router.push('/(patient)/privacy-policy')}
      onRecord={(id: ProfileRecordId | 'support-report') => {
        if (id === 'support-report') {
          router.push('/(patient)/healthcare-support');
          return;
        }
        if (id === 'medical-docs') {
          router.push('/(patient)/care');
          return;
        }
        if (id === 'prescription') {
          router.push('/(patient)/prescriptions');
          return;
        }
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
