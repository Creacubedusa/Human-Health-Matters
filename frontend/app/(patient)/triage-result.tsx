import { useLocalSearchParams, useRouter } from 'expo-router';
import { TriageResultView } from '@features/patient/screens/TriageResultView';
import { useTriageStore } from '@features/patient/store/triage.store';

export default function TriageResultScreen() {
  const router = useRouter();
  const { currentSession } = useTriageStore();
  const { sessionId } = useLocalSearchParams<{ sessionId: string }>();

  const result = currentSession?.result ?? null;

  if (!result || result.sessionId !== sessionId) {
    // Fallback: go back if result is missing (shouldn't happen in normal flow)
    router.back();
    return null;
  }

  return (
    <TriageResultView
      onBack={() => router.back()}
      onClose={() => router.replace('/(patient)')}
      onConnectDoctor={() => router.push('/(patient)/insurance')}
      result={result}
    />
  );
}
