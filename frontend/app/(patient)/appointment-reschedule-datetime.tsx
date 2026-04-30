import { useState } from 'react';
import { useRouter } from 'expo-router';
import { AppointmentRescheduleDateTimeView } from '@features/patient/screens/AppointmentRescheduleDateTimeView';
import { AppointmentActionSuccessModal } from '@features/patient/components/appointment/AppointmentActionSuccessModal';

export default function AppointmentRescheduleDateTimeScreen() {
  const router = useRouter();
  const [successVisible, setSuccessVisible] = useState(false);

  function handleBack() {
<<<<<<< HEAD:app/(patient)/appointment-reschedule-datetime.tsx
    router.back();
=======
    if (router.canGoBack()) {
      router.back();
      return;
    }

    router.replace('/(patient)/appointment');
>>>>>>> 290025c34b3930e6341a697d4a0c37e6f2562012:frontend/app/(patient)/appointment-reschedule-datetime.tsx
  }

  return (
    <>
      <AppointmentRescheduleDateTimeView
        onBack={handleBack}
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
