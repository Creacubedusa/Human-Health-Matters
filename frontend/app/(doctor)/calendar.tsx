import { useRouter } from 'expo-router';
import { DoctorAppointmentCalendarView } from '@features/doctor/screens/DoctorAppointmentCalendarView';
import { goBackOrReplace } from '@shared/navigation/goBackOrReplace';

export default function DoctorCalendarScreen() {
  const router = useRouter();

  return (
    <DoctorAppointmentCalendarView
      onBack={() => goBackOrReplace(router, '/(doctor)/consultations')}
      onAddAppointment={() => router.push('/(doctor)/appointment-create')}
      onSetAvailability={() => router.push('/(doctor)/availability')}
    />
  );
}
