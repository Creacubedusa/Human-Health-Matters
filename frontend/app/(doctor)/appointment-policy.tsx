import { useLocalSearchParams, useRouter } from 'expo-router';
import { DoctorAppointmentPolicyView } from '@features/doctor/screens/DoctorAppointmentPolicyView';
import type { DoctorAppointmentActionType } from '@features/doctor/types/doctorAppointments.types';
import { goBackOrReplace } from '@shared/navigation/goBackOrReplace';

export default function DoctorAppointmentPolicyScreen() {
  const router = useRouter();
  const { type } = useLocalSearchParams<{ type: DoctorAppointmentActionType }>();
  const actionType: DoctorAppointmentActionType = type === 'cancel' ? 'cancel' : 'reschedule';

  return (
    <DoctorAppointmentPolicyView
      type={actionType}
      onBack={() => goBackOrReplace(router, '/(doctor)/consultations')}
      onNext={() => router.push(`/(doctor)/appointment-reason?type=${actionType}`)}
    />
  );
}
