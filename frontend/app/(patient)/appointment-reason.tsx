import { useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { AppointmentReasonView } from '@features/patient/screens/AppointmentReasonView';
import { AppointmentActionSuccessModal } from '@features/patient/components/appointment/AppointmentActionSuccessModal';
import { useAppointmentManagementStore } from '@features/patient/store/appointmentManagement.store';
import { cancelAppointment } from '@features/patient/services/appointmentManagement.service';
import type { AppointmentActionType } from '@features/patient/types/appointmentManagement.types';
import { goBackOrReplace } from '@shared/navigation/goBackOrReplace';

export default function AppointmentReasonScreen() {
  const router = useRouter();
  const { type } = useLocalSearchParams<{ type: AppointmentActionType }>();
  const actionType: AppointmentActionType = type === 'cancel' ? 'cancel' : 'reschedule';
  const store = useAppointmentManagementStore();
  const [successVisible, setSuccessVisible] = useState(false);

  async function handleNext() {
    if (!store.selectedId) {
      router.replace('/(patient)/appointment');
      return;
    }

    if (actionType === 'cancel') {
      if (!store.cancelReason) return;
      await cancelAppointment(store.selectedId);
      store.applyCancel();
      setSuccessVisible(true);
    } else {
      if (!store.rescheduleReason) return;
      router.push('/(patient)/appointment-reschedule-datetime');
    }
  }

  return (
    <>
      <AppointmentReasonView
        type={actionType}
        onBack={() => goBackOrReplace(router, '/(patient)/appointment-policy')}
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
