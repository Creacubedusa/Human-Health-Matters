import { useLocalSearchParams, useRouter } from 'expo-router';
import { DoctorCreateOrderWizardView } from '@features/doctor/screens/DoctorCreateOrderWizardView';

export default function DoctorCreateOrderWizardScreen() {
  const router = useRouter();
  const { patientId } = useLocalSearchParams<{ patientId?: string }>();

  return (
    <DoctorCreateOrderWizardView
      preselectedPatientId={patientId}
      onBack={() => router.back()}
      onSuccess={() => router.replace('/(doctor)/patients')}
    />
  );
}
