import { useRouter } from 'expo-router';
import { DoctorAppointmentCalendarView } from '@features/doctor/screens/DoctorAppointmentCalendarView';

export default function DoctorCalendarScreen() {
  const router = useRouter();

  return (
    <DoctorAppointmentCalendarView
      onBack={() => {
        if (router.canGoBack()) { router.back(); return; }
        router.replace('/(doctor)/consultations');
      }}
      onAddAppointment={() => router.push('/(doctor)/appointment-create')}
      onSetAvailability={() => router.push('/(doctor)/availability')}
    />
  );
}
