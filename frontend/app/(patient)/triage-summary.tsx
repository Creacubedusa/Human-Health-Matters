import { useLocalSearchParams, useRouter } from 'expo-router';
import { TriageSummaryView } from '@features/patient/screens/TriageSummaryView';
import { goBackOrReplace } from '@shared/navigation/goBackOrReplace';

export default function TriageSummaryScreen() {
  const router = useRouter();
  const { summary } = useLocalSearchParams<{ summary: string }>();

  return (
    <TriageSummaryView
      onBack={() => goBackOrReplace(router, '/(patient)/triage-history')}
      summary={summary ?? ''}
    />
  );
}
