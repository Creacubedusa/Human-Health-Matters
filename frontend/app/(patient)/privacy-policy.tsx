import { useRouter } from 'expo-router';
import { PrivacyPolicyView } from '@features/patient/screens/PrivacyPolicyView';

export default function PrivacyPolicyScreen() {
  const router = useRouter();

  function handleBack() {
    if (router.canGoBack()) {
      router.back();
      return;
    }

    router.replace('/(patient)/profile');
  }

  return <PrivacyPolicyView onBack={handleBack} />;
}
