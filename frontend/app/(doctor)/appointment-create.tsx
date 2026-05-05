import { useLocalSearchParams, useRouter } from 'expo-router';
import { DoctorAddAppointmentView } from '@features/doctor/screens/DoctorAddAppointmentView';

export default function DoctorAddAppointmentScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ title?: string; patientName?: string }>();

  function handleBack() {
    if (router.canGoBack()) {
      router.back();
      return;
    }

    router.replace('/(doctor)/calendar');
  }

  return (
    <DoctorAddAppointmentView
      onBack={handleBack}
      initialTitle={params.title ? String(params.title) : undefined}
      initialPatientName={params.patientName ? String(params.patientName) : undefined}
    />
  );
}
