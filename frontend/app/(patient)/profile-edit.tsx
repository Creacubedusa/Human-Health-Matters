import { useRouter } from 'expo-router';
import { PatientProfileEditView } from '@features/patient/screens/PatientProfileEditView';

export default function PatientProfileEditScreen() {
  const router = useRouter();

  function handleBack() {
<<<<<<< HEAD:app/(patient)/profile-edit.tsx
    router.back();
=======
    if (router.canGoBack()) {
      router.back();
      return;
    }

    router.replace('/(patient)/profile');
>>>>>>> 290025c34b3930e6341a697d4a0c37e6f2562012:frontend/app/(patient)/profile-edit.tsx
  }

  return (
    <PatientProfileEditView
      onBack={handleBack}
      onSaveComplete={() => router.replace('/(patient)/profile')}
    />
  );
}
