import { useRouter } from 'expo-router';
import { PatientProfileEditView } from '@features/patient/screens/PatientProfileEditView';

export default function PatientProfileEditScreen() {
  const router = useRouter();

  function handleBack() {
    router.back();
  }

  return (
    <PatientProfileEditView
      onBack={handleBack}
      onSaveComplete={() => router.replace('/(patient)/profile')}
    />
  );
}
