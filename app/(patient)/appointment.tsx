import { useState } from 'react';
import { useRouter } from 'expo-router';
import { AppointmentHomeView } from '@features/patient/screens/AppointmentHomeView';
import { AppointmentActionSuccessModal } from '@features/patient/components/appointment/AppointmentActionSuccessModal';
import { useAppointmentManagementStore } from '@features/patient/store/appointmentManagement.store';

export default function AppointmentScreen() {
  const router = useRouter();
  const store = useAppointmentManagementStore();
  const [successVisible, setSuccessVisible] = useState(false);

  function handleCancelConfirmed() {
    store.closeModals();
    router.push('/(patient)/appointment-policy?type=cancel');
  }

  function handleRescheduleConfirmed() {
    store.closeModals();
    router.push('/(patient)/appointment-policy?type=reschedule');
  }

  return (
    <>
      <AppointmentHomeView
        onBookAppointment={() => router.push('/(patient)/insurance')}
        onCancelConfirmed={handleCancelConfirmed}
        onRescheduleConfirmed={handleRescheduleConfirmed}
      />

      {/* Cancel success modal rendered at route level so it survives screen transitions */}
      <AppointmentActionSuccessModal
        visible={successVisible}
        type="cancel"
        onClose={() => setSuccessVisible(false)}
        onGoBack={() => setSuccessVisible(false)}
      />
    </>
  );
}
