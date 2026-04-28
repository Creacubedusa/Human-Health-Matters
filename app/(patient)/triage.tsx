import { useRouter } from 'expo-router';
import { NuraTriageView } from '@features/patient/screens/NuraTriageView';
import { useTriageStore } from '@features/patient/store/triage.store';
import type { TriageResult } from '@features/patient/types/triage.types';

export default function PatientTriageScreen() {
  const router = useRouter();
  const { currentSession } = useTriageStore();

  function handleViewResult(result: TriageResult) {
    router.push({ pathname: '/(patient)/triage-result', params: { sessionId: result.sessionId } });
  }

  return (
    <NuraTriageView
      onBack={() => router.back()}
      onLanguage={() => router.push('/(auth)/select-language')}
      onHistory={() => router.push('/(patient)/triage-history')}
      onViewResult={handleViewResult}
    />
  );
}
