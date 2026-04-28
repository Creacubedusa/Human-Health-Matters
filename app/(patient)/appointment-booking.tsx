import { Tabs, useNavigation, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { AppointmentBookingView } from '@features/patient/screens/AppointmentBookingView';
import { useAppointmentBookingStore } from '@features/patient/store/appointmentBooking.store';

export default function AppointmentBookingScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const accessSnapshot = useAppointmentBookingStore((state) => state.accessSnapshot);

  useEffect(() => {
    if (!accessSnapshot) {
      router.replace('/(patient)/appointment');
    }
  }, [accessSnapshot, router]);

  function handleExit() {
    if (navigation.canGoBack()) {
      router.back();
      return;
    }

    router.replace('/(patient)/appointment');
  }

  if (!accessSnapshot) {
    return null;
  }

  return (
    <>
      <Tabs.Screen options={{ tabBarStyle: { display: 'none' } }} />
      <AppointmentBookingView
        onExit={handleExit}
        onFinish={() => router.replace('/(patient)/consultations')}
      />
    </>
  );
}
