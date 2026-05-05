import { useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { DoctorAppointmentReasonView } from '@features/doctor/screens/DoctorAppointmentReasonView';
import { DoctorAppointmentActionSuccessModal } from '@features/doctor/components/appointments/DoctorAppointmentActionSuccessModal';
import { useDoctorAppointmentsStore } from '@features/doctor/store/doctorAppointments.store';
import { cancelDoctorAppointment } from '@features/doctor/services/doctor.service';
import type { DoctorAppointmentActionType } from '@features/doctor/types/doctorAppointments.types';

export default function DoctorAppointmentReasonScreen() {
  const router = useRouter();
  const { type } = useLocalSearchParams<{ type: DoctorAppointmentActionType }>();
  const actionType: DoctorAppointmentActionType = type === 'cancel' ? 'cancel' : 'reschedule';
  const store = useDoctorAppointmentsStore();
  const [successVisible, setSuccessVisible] = useState(false);

  async function handleNext() {
    if (!store.selectedId) {
      router.replace('/(doctor)/consultations');
      return;
    }

    if (actionType === 'cancel') {
      if (!store.cancelReason) return;
      await cancelDoctorAppointment(store.selectedId);
      store.applyCancel();
      setSuccessVisible(true);
    } else {
      if (!store.rescheduleReason) return;
      router.push('/(doctor)/appointment-reschedule-datetime');
    }
  }

  function handleDone() {
    setSuccessVisible(false);
    router.replace('/(doctor)/consultations');
  }

  return (
    <>
      <DoctorAppointmentReasonView
        type={actionType}
        onBack={() => router.back()}
        onNext={() => void handleNext()}
      />

      <DoctorAppointmentActionSuccessModal
        visible={successVisible}
        type="cancel"
        onClose={handleDone}
        onGoBack={handleDone}
      />
    </>
  );
}
