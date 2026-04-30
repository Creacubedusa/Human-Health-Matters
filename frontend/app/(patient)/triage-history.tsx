import { useRouter } from 'expo-router';
import { TriageHistoryView } from '@features/patient/screens/TriageHistoryView';
import { useTriageStore } from '@features/patient/store/triage.store';

export default function TriageHistoryScreen() {
  const router = useRouter();
  const { history } = useTriageStore();

  function handleViewSummary(id: string) {
    const item = history.find((h) => h.id === id);
    const summary = item?.summary ?? '';
    router.push({ pathname: '/(patient)/triage-summary', params: { summary } });
  }

  return (
    <TriageHistoryView
      onBack={() => router.back()}
      onViewSummary={handleViewSummary}
    />
  );
}
