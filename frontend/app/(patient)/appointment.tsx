import { useRouter } from 'expo-router';
import { AppointmentHomeView } from '@features/patient/screens/AppointmentHomeView';
import { useAppointmentManagementStore } from '@features/patient/store/appointmentManagement.store';

export default function AppointmentScreen() {
  const router = useRouter();
  const store = useAppointmentManagementStore();

  function handleCancelConfirmed() {
    store.closeModals();
    router.push('/(patient)/appointment-policy?type=cancel');
  }

  function handleRescheduleConfirmed() {
    store.closeModals();
    router.push('/(patient)/appointment-policy?type=reschedule');
  }

  function handleBack() {
    if (router.canGoBack()) {
      router.back();
      return;
    }

    router.replace('/(patient)');
  }

  return (
    <AppointmentHomeView
      onBack={handleBack}
      onCalendar={() => router.push('/(patient)/calendar')}
      onBookAppointment={() => router.push('/(patient)/book-appointment')}
      onCancelConfirmed={handleCancelConfirmed}
      onRescheduleConfirmed={handleRescheduleConfirmed}
      onJoinAppointment={(id) => router.push(`/(patient)/consultations?appointmentId=${id}`)}
    />
  );
}
