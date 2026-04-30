import { Tabs, useRouter } from 'expo-router';
import { OrderListView } from '@features/patient/screens/OrderListView';

export default function OrdersScreen() {
  const router = useRouter();

  return (
    <>
      <Tabs.Screen options={{ tabBarStyle: { display: 'none' } }} />
      <OrderListView
        onBack={() => (router.canGoBack() ? router.back() : router.replace('/(patient)/profile'))}
        onSelectOrder={(id) =>
          router.push({ pathname: '/(patient)/order-detail', params: { id } })
        }
      />
    </>
  );
}
