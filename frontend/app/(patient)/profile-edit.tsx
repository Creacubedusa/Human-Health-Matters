import { useRouter } from 'expo-router';
import { PatientProfileEditView } from '@features/patient/screens/PatientProfileEditView';
import { goBackOrReplace } from '@shared/navigation/goBackOrReplace';

export default function PatientProfileEditScreen() {
  const router = useRouter();

  function handleBack() {
    goBackOrReplace(router, '/(patient)/profile');
  }

  return (
    <PatientProfileEditView
      onBack={handleBack}
      onSaveComplete={() => router.replace('/(patient)/profile')}
    />
  );
}
