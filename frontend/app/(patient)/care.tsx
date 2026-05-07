import { useRouter } from 'expo-router';
import { CarePlanView } from '@features/patient/screens/CarePlanView';
import { goBackOrReplace } from '@shared/navigation/goBackOrReplace';

export default function CareScreen() {
  const router = useRouter();

  function handleBack() {
    goBackOrReplace(router, '/(patient)');
  }

  return (
    <CarePlanView
      onBack={handleBack}
      onViewCarePlan={(id) => router.push({ pathname: '/(patient)/care-plan-detail', params: { id } })}
    />
  );
}
