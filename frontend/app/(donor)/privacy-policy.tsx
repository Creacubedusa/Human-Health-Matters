import { useRouter } from 'expo-router';
import { PrivacyPolicyView } from '@features/patient/screens/PrivacyPolicyView';
import { goBackOrReplace } from '@shared/navigation/goBackOrReplace';

export default function DonorPrivacyPolicyScreen() {
  const router = useRouter();

  function handleBack() {
    goBackOrReplace(router, '/(donor)/profile');
  }

  return <PrivacyPolicyView onBack={handleBack} />;
}
