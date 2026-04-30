import { Tabs, useLocalSearchParams, useRouter } from 'expo-router';
import { OrderDetailView } from '@features/patient/screens/OrderDetailView';

export default function OrderDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <>
      <Tabs.Screen options={{ tabBarStyle: { display: 'none' } }} />
      <OrderDetailView
        orderId={id ?? ''}
        onBack={() => router.back()}
      />
    </>
  );
}
