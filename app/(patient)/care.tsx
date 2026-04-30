import { useRouter } from 'expo-router';
import { CarePlanView } from '@features/patient/screens/CarePlanView';

export default function CareScreen() {
  const router = useRouter();

  function handleBack() {
    router.back();
  }

  return (
    <CarePlanView
      onBack={handleBack}
      onViewCarePlan={(id) => router.push({ pathname: '/(patient)/care-plan-detail', params: { id } })}
    />
  );
}
