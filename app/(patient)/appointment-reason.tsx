import { useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { AppointmentReasonView } from '@features/patient/screens/AppointmentReasonView';
import { AppointmentActionSuccessModal } from '@features/patient/components/appointment/AppointmentActionSuccessModal';
import { useAppointmentManagementStore } from '@features/patient/store/appointmentManagement.store';
import type { AppointmentActionType } from '@features/patient/types/appointmentManagement.types';

export default function AppointmentReasonScreen() {
  const router = useRouter();
  const { type } = useLocalSearchParams<{ type: AppointmentActionType }>();
  const actionType: AppointmentActionType = type === 'cancel' ? 'cancel' : 'reschedule';
  const store = useAppointmentManagementStore();
  const [successVisible, setSuccessVisible] = useState(false);

  function handleNext() {
    if (actionType === 'cancel') {
      store.applyCancel();
      setSuccessVisible(true);
    } else {
      router.push('/(patient)/appointment-reschedule-datetime');
    }
  }

  return (
    <>
      <AppointmentReasonView
        type={actionType}
        onBack={() => router.back()}
        onNext={handleNext}
      />

      <AppointmentActionSuccessModal
        visible={successVisible}
        type="cancel"
        onClose={() => { setSuccessVisible(false); router.replace('/(patient)/appointment'); }}
        onGoBack={() => { setSuccessVisible(false); router.replace('/(patient)/appointment'); }}
      />
    </>
  );
}
