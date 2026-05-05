import { useRouter } from 'expo-router';
import { DoctorConsultationsView } from '@features/doctor/screens/DoctorConsultationsView';
import { useDoctorAppointmentsStore } from '@features/doctor/store/doctorAppointments.store';

export default function DoctorConsultationsScreen() {
  const router = useRouter();
  const store = useDoctorAppointmentsStore();

  function handleCancelConfirmed() {
    store.closeModals();
    router.push('/(doctor)/appointment-policy?type=cancel');
  }

  function handleRescheduleConfirmed() {
    store.closeModals();
    router.push('/(doctor)/appointment-policy?type=reschedule');
  }

  return (
    <DoctorConsultationsView
      onCalendar={() => router.push('/(doctor)/calendar')}
      onCancelConfirmed={handleCancelConfirmed}
      onRescheduleConfirmed={handleRescheduleConfirmed}
      onJoinAppointment={(id) =>
        router.push({ pathname: '/(doctor)/consultation', params: { appointmentId: id } })
      }
    />
  );
}
