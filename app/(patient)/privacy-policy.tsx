import { useRouter } from 'expo-router';
import { PrivacyPolicyView } from '@features/patient/screens/PrivacyPolicyView';

export default function PrivacyPolicyScreen() {
  const router = useRouter();

  function handleBack() {
    router.back();
  }

  return <PrivacyPolicyView onBack={handleBack} />;
}
