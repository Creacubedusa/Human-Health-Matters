import { useRouter } from 'expo-router';
import { DonorNotificationsView } from '@features/donor/screens/DonorNotificationsView';
import { goBackOrReplace } from '@shared/navigation/goBackOrReplace';

export default function DonorNotificationsScreen() {
  const router = useRouter();

  return <DonorNotificationsView onBack={() => goBackOrReplace(router, '/(donor)')} />;
}
