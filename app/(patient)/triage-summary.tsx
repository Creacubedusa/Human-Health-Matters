import { useLocalSearchParams, useRouter } from 'expo-router';
import { TriageSummaryView } from '@features/patient/screens/TriageSummaryView';

export default function TriageSummaryScreen() {
  const router = useRouter();
  const { summary } = useLocalSearchParams<{ summary: string }>();

  return (
    <TriageSummaryView
      onBack={() => router.back()}
      summary={summary ?? ''}
    />
  );
}
