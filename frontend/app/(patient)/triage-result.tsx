import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { TriageResultView } from '@features/patient/screens/TriageResultView';
import { useTriageStore } from '@features/patient/store/triage.store';
import { goBackOrReplace } from '@shared/navigation/goBackOrReplace';

export default function TriageResultScreen() {
  const router = useRouter();
  const { currentSession } = useTriageStore();
  const { sessionId } = useLocalSearchParams<{ sessionId: string }>();

  const result = currentSession?.result ?? null;
  const isMissingResult = !result || result.sessionId !== sessionId;

  useEffect(() => {
    if (!isMissingResult) return;
    router.replace('/(patient)/triage');
  }, [isMissingResult, router]);

  if (isMissingResult) return null;

  return (
    <TriageResultView
      onBack={() => goBackOrReplace(router, '/(patient)/triage')}
      onClose={() => router.replace('/(patient)')}
      onConnectDoctor={() => router.push('/(patient)/insurance')}
      result={result}
    />
  );
}
