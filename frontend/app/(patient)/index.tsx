import { useRouter } from 'expo-router';
import { PatientHomeView } from '@features/patient/screens/PatientHomeView';

export default function PatientHomeScreen() {
  const router = useRouter();

  return (
    <PatientHomeView
      onCalendar={() => router.push('/(patient)/calendar')}
      onNotification={() => router.push('/(patient)/notifications')}
      onProfile={() => router.push('/(patient)/profile')}
      onLanguage={() => router.push('/(auth)/select-language')}
      onViewCarePlan={(id) =>
        router.push({ pathname: '/(patient)/care-plan-detail', params: { id } })
      }
      onCheckSymptoms={() => router.push('/(patient)/triage')}
      onBook={() => router.push('/(patient)/book-appointment')}
      onDiagnosis={() => router.push('/(patient)/care')}
      onPrescription={() => router.push('/(patient)/prescriptions')}
      onTest={() => router.push('/(patient)/orders')}
      onJoinConsultation={(appointmentId) =>
        router.push({
          pathname: '/(patient)/consultations',
          params: { appointmentId },
        })
      }
    />
  );
}
