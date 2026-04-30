import { useLocalSearchParams, useRouter } from 'expo-router';
import { CarePlanDetailView } from '@features/patient/screens/CarePlanDetailView';

export default function CarePlanDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();

  function handleBack() {
<<<<<<< HEAD:app/(patient)/care-plan-detail.tsx
    router.back();
=======
    if (router.canGoBack()) {
      router.back();
      return;
    }

    router.replace('/(patient)/care');
>>>>>>> 290025c34b3930e6341a697d4a0c37e6f2562012:frontend/app/(patient)/care-plan-detail.tsx
  }

  return <CarePlanDetailView carePlanId={id ?? ''} onBack={handleBack} />;
}
