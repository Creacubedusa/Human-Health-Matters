import { useLocalSearchParams, useRouter } from 'expo-router';
import { DoctorConsultationView } from '@features/doctor/screens/DoctorConsultationView';

export default function DoctorConsultationScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ appointmentId?: string }>();
  const appointmentId = params.appointmentId ? String(params.appointmentId) : '';

  return (
    <DoctorConsultationView
      appointmentId={appointmentId}
      onBack={() => (router.canGoBack() ? router.back() : router.replace('/(doctor)/consultations'))}
      onEnded={() => router.replace('/(doctor)/consultations')}
    />
  );
}

