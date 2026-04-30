import { Tabs, useRouter } from 'expo-router';
import { TestsView } from '@features/patient/screens/TestsView';

export default function TestsScreen() {
  const router = useRouter();

  return (
    <>
      <Tabs.Screen options={{ tabBarStyle: { display: 'none' } }} />
      <TestsView
        onBack={() => (router.canGoBack() ? router.back() : router.replace('/(patient)/profile'))}
      />
    </>
  );
}
