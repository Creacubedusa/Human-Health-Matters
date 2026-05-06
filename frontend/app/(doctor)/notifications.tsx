import { useRouter } from 'expo-router';
import { DoctorNotificationsView } from '@features/doctor/screens/DoctorNotificationsView';
import { goBackOrReplace } from '@shared/navigation/goBackOrReplace';

export default function DoctorNotificationsScreen() {
  const router = useRouter();

  return (
    <DoctorNotificationsView
      onBack={() => goBackOrReplace(router, '/(doctor)')}
      onJoinConsultation={(appointmentId) =>
        router.push({
          pathname: '/(doctor)/consultation',
          params: { appointmentId },
        })
      }
      onViewPatient={(patientId) => router.push(`/(doctor)/patients/${patientId}`)}
      onReviewSummary={() => router.push('/(doctor)/nura-ai-summary')}
      onCheckRecord={(patientId) =>
        router.push(`/(doctor)/patients/${patientId}/records/tests`)
      }
    />
  );
}
