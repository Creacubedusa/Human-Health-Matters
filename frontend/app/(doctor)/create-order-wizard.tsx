import { useLocalSearchParams, useRouter } from 'expo-router';
import { DoctorCreateOrderWizardView } from '@features/doctor/screens/DoctorCreateOrderWizardView';
import { goBackOrReplace } from '@shared/navigation/goBackOrReplace';

export default function DoctorCreateOrderWizardScreen() {
  const router = useRouter();
  const { patientId } = useLocalSearchParams<{ patientId?: string }>();

  return (
    <DoctorCreateOrderWizardView
      preselectedPatientId={patientId}
      onBack={() => goBackOrReplace(router, '/(doctor)/patients')}
      onSuccess={() => router.replace('/(doctor)/patients')}
    />
  );
}
