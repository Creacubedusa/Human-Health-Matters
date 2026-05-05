import { useRouter } from 'expo-router';
import { DoctorNotificationsView } from '@features/doctor/screens/DoctorNotificationsView';

export default function DoctorNotificationsScreen() {
  const router = useRouter();

  return (
    <DoctorNotificationsView
      onBack={() => router.back()}
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
