import { useState } from 'react';
import { useRouter } from 'expo-router';
import { DoctorAppointmentRescheduleDateTimeView } from '@features/doctor/screens/DoctorAppointmentRescheduleDateTimeView';
import { DoctorAppointmentActionSuccessModal } from '@features/doctor/components/appointments/DoctorAppointmentActionSuccessModal';

export default function DoctorAppointmentRescheduleDateTimeScreen() {
  const router = useRouter();
  const [successVisible, setSuccessVisible] = useState(false);

  function handleBack() {
    if (router.canGoBack()) { router.back(); return; }
    router.replace('/(doctor)/consultations');
  }

  function handleDone() {
    setSuccessVisible(false);
    router.replace('/(doctor)/consultations');
  }

  return (
    <>
      <DoctorAppointmentRescheduleDateTimeView
        onBack={handleBack}
        onSuccess={() => setSuccessVisible(true)}
      />

      <DoctorAppointmentActionSuccessModal
        visible={successVisible}
        type="reschedule"
        onClose={handleDone}
        onGoBack={handleDone}
      />
    </>
  );
}
