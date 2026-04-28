import { useState } from 'react';
import { useRouter } from 'expo-router';
import { AppointmentRescheduleDateTimeView } from '@features/patient/screens/AppointmentRescheduleDateTimeView';
import { AppointmentActionSuccessModal } from '@features/patient/components/appointment/AppointmentActionSuccessModal';

export default function AppointmentRescheduleDateTimeScreen() {
  const router = useRouter();
  const [successVisible, setSuccessVisible] = useState(false);

  return (
    <>
      <AppointmentRescheduleDateTimeView
        onBack={() => router.back()}
        onSuccess={() => setSuccessVisible(true)}
      />

      <AppointmentActionSuccessModal
        visible={successVisible}
        type="reschedule"
        onClose={() => { setSuccessVisible(false); router.replace('/(patient)/appointment'); }}
        onGoBack={() => { setSuccessVisible(false); router.replace('/(patient)/appointment'); }}
      />
    </>
  );
}
