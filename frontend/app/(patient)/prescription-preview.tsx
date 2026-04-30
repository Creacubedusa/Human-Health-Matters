import { Tabs, useLocalSearchParams, useRouter } from 'expo-router';
import { PrescriptionPreviewView } from '@features/patient/screens/PrescriptionPreviewView';

export default function PrescriptionPreviewScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();

  return (
    <>
      <Tabs.Screen options={{ tabBarStyle: { display: 'none' } }} />
      <PrescriptionPreviewView
        prescriptionId={id ?? ''}
        onBack={() => (router.canGoBack() ? router.back() : router.replace('/(patient)/prescriptions'))}
      />
    </>
  );
}
