import { useRouter } from 'expo-router';
import { PatientHomeView } from '@features/patient/screens/PatientHomeView';

export default function PatientHomeScreen() {
  const router = useRouter();

  return (
    <PatientHomeView
      onCalendar={() => router.push('/(patient)/appointment')}
      onNotification={() => router.push('/(patient)/notifications')}
      onLanguage={() => router.push('/(auth)/select-language')}
      onViewCarePlan={() => router.push('/(patient)/care')}
      onCheckSymptoms={() => router.push('/(patient)/triage')}
      onBook={() => router.push('/(patient)/appointment')}
      onDiagnosis={() => {}}
      onPrescription={() => {}}
      onTest={() => {}}
      onJoinConsultation={() => {}}
    />
  );
}
