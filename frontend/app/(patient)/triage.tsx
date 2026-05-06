import { useRouter } from 'expo-router';
import { NuraTriageView } from '@features/patient/screens/NuraTriageView';
import { useTriageStore } from '@features/patient/store/triage.store';
import type { TriageResult } from '@features/patient/types/triage.types';
import { goBackOrReplace } from '@shared/navigation/goBackOrReplace';

export default function PatientTriageScreen() {
  const router = useRouter();
  const { currentSession } = useTriageStore();

  function handleViewResult(result: TriageResult) {
    router.push({ pathname: '/(patient)/triage-result', params: { sessionId: result.sessionId } });
  }

  return (
    <NuraTriageView
      onBack={() => goBackOrReplace(router, '/(patient)')}
      onLanguage={() => router.push('/(auth)/select-language')}
      onHistory={() => router.push('/(patient)/triage-history')}
      onViewResult={handleViewResult}
    />
  );
}
