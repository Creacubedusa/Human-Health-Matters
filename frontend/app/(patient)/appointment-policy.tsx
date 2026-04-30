import { useLocalSearchParams, useRouter } from 'expo-router';
import { AppointmentPolicyView } from '@features/patient/screens/AppointmentPolicyView';
import type { AppointmentActionType } from '@features/patient/types/appointmentManagement.types';

export default function AppointmentPolicyScreen() {
  const router = useRouter();
  const { type } = useLocalSearchParams<{ type: AppointmentActionType }>();
  const actionType: AppointmentActionType = type === 'cancel' ? 'cancel' : 'reschedule';

  return (
    <AppointmentPolicyView
      type={actionType}
      onBack={() => router.back()}
      onNext={() => router.push(`/(patient)/appointment-reason?type=${actionType}`)}
    />
  );
}
