import { Tabs, useRouter } from 'expo-router';
import { PrescriptionListView } from '@features/patient/screens/PrescriptionListView';

export default function PrescriptionsScreen() {
  const router = useRouter();

  return (
    <>
      <Tabs.Screen options={{ tabBarStyle: { display: 'none' } }} />
      <PrescriptionListView
        onBack={() => (router.canGoBack() ? router.back() : router.replace('/(patient)'))}
        onSelectPrescription={(id) =>
          router.push({ pathname: '/(patient)/prescription-detail', params: { id } })
        }
      />
    </>
  );
}
