import { useLocalSearchParams, useRouter } from 'expo-router';
import { DoctorAddAppointmentView } from '@features/doctor/screens/DoctorAddAppointmentView';
import { goBackOrReplace } from '@shared/navigation/goBackOrReplace';

export default function DoctorAddAppointmentScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ title?: string; patientName?: string }>();

  function handleBack() {
    goBackOrReplace(router, '/(doctor)/calendar');
  }

  return (
    <DoctorAddAppointmentView
      onBack={handleBack}
      initialTitle={params.title ? String(params.title) : undefined}
      initialPatientName={params.patientName ? String(params.patientName) : undefined}
    />
  );
}
