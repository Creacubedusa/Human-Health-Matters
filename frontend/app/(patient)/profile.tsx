import { useRouter } from 'expo-router';
import { PatientProfileOverviewView } from '@features/patient/screens/PatientProfileOverviewView';
import type { ProfileRecordId } from '@features/patient/types/profileOverview.types';
import { useAuthStore } from '@shared/store/auth.store';
import { usePatientStore } from '@features/patient/store/patient.store';
import { setAccessToken } from '@shared/api/token';
import { kvDelete } from '@shared/storage/kv';

export default function PatientProfileScreen() {
  const router = useRouter();
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const clearPatient = usePatientStore((s) => s.clearPatient);

  function handleBack() {
    if (router.canGoBack()) {
      router.back();
      return;
    }

    router.replace('/(patient)');
  }

  async function handleLogout() {
    clearAuth();
    clearPatient();
    await setAccessToken(null);
    await kvDelete('app_role');
    await kvDelete('app_user_id');
    router.replace('/(auth)/select-language');
  }

  return (
    <PatientProfileOverviewView
      onBack={handleBack}
      onEdit={() => router.push('/(patient)/profile-edit')}
      onCompleteProfile={() => router.push('/(auth)/patient-profile')}
      onLanguage={() => router.push('/(auth)/select-language')}
      onPrivacy={() => router.push('/(patient)/privacy-policy')}
      onLogout={handleLogout}
      onRecord={(id: ProfileRecordId | 'support-report') => {
        if (id === 'support-report') {
          router.push('/(patient)/healthcare-support');
          return;
        }
        if (id === 'order') {
          router.push('/(patient)/orders');
          return;
        }
        if (id === 'prescription') {
          router.push('/(patient)/prescriptions');
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
