import { useRouter } from 'expo-router';
import { PrivacyPolicyView } from '@features/patient/screens/PrivacyPolicyView';

export default function PrivacyPolicyScreen() {
  const router = useRouter();

  function handleBack() {
<<<<<<< HEAD:app/(patient)/privacy-policy.tsx
    router.back();
=======
    if (router.canGoBack()) {
      router.back();
      return;
    }

    router.replace('/(patient)/profile');
>>>>>>> 290025c34b3930e6341a697d4a0c37e6f2562012:frontend/app/(patient)/privacy-policy.tsx
  }

  return <PrivacyPolicyView onBack={handleBack} />;
}
