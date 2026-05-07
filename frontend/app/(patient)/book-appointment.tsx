import { Tabs, useRouter } from 'expo-router';
import { BookAppointmentView } from '@features/patient/screens/BookAppointmentView';
import { goBackOrReplace } from '@shared/navigation/goBackOrReplace';

export default function BookAppointmentScreen() {
  const router = useRouter();

  return (
    <>
      <Tabs.Screen options={{ tabBarStyle: { display: 'none' } }} />
      <BookAppointmentView
        onBack={() => goBackOrReplace(router, '/(patient)/appointment')}
        onSymptoms={() => router.push('/(patient)/triage')}
        onFollowUp={() => router.push('/(patient)/triage')}
      />
    </>
  );
}
