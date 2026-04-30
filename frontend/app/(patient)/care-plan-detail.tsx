import { useLocalSearchParams, useRouter } from 'expo-router';
import { CarePlanDetailView } from '@features/patient/screens/CarePlanDetailView';

export default function CarePlanDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();

  function handleBack() {
    if (router.canGoBack()) {
      router.back();
      return;
    }

    router.replace('/(patient)/care');
  }

  return <CarePlanDetailView carePlanId={id ?? ''} onBack={handleBack} />;
}
