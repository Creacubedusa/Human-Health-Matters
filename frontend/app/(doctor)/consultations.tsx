import { useRouter } from 'expo-router';
import { DoctorConsultationsView } from '@features/doctor/screens/DoctorConsultationsView';
import { useDoctorAppointmentsStore } from '@features/doctor/store/doctorAppointments.store';
import { toast } from '@shared/components/ui/toast';

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

  function handleJoinAppointment(id: string) {
    const appointment = store.appointments.find((item) => item.id === id);
    if (appointment?.status === 'completed') {
      toast.info('This consultation has already been completed.');
      return;
    }

    router.push({ pathname: '/(doctor)/consultation', params: { appointmentId: id } });
  }

  return (
    <DoctorConsultationsView
      onCalendar={() => router.push('/(doctor)/calendar')}
      onCancelConfirmed={handleCancelConfirmed}
      onRescheduleConfirmed={handleRescheduleConfirmed}
      onJoinAppointment={handleJoinAppointment}
    />
  );
}
