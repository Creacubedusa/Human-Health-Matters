import { Tabs, useLocalSearchParams, useRouter } from 'expo-router';
import { PrescriptionDetailView } from '@features/patient/screens/PrescriptionDetailView';

export default function PrescriptionDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();

  return (
    <>
      <Tabs.Screen options={{ tabBarStyle: { display: 'none' } }} />
      <PrescriptionDetailView
        prescriptionId={id ?? ''}
        onBack={() => (router.canGoBack() ? router.back() : router.replace('/(patient)/prescriptions'))}
        onPreview={(prescriptionId) =>
          router.push({ pathname: '/(patient)/prescription-preview', params: { id: prescriptionId } })
        }
      />
    </>
  );
}
