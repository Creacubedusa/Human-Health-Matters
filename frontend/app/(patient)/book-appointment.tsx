import { Tabs, useRouter } from 'expo-router';
import { BookAppointmentView } from '@features/patient/screens/BookAppointmentView';

export default function BookAppointmentScreen() {
  const router = useRouter();

  return (
    <>
      <Tabs.Screen options={{ tabBarStyle: { display: 'none' } }} />
      <BookAppointmentView
        onBack={() => router.back()}
        onSymptoms={() => router.push('/(patient)/triage')}
        onFollowUp={() => router.push('/(patient)/triage')}
      />
    </>
  );
}
