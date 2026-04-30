import { useState } from 'react';
import { useRouter } from 'expo-router';
import { CalendarView } from '@features/patient/screens/CalendarView';
import { AppointmentConfirmModal } from '@features/patient/components/appointment/AppointmentConfirmModal';
import { useAppointmentManagementStore } from '@features/patient/store/appointmentManagement.store';
import type { AppointmentActionType } from '@features/patient/types/appointmentManagement.types';

export default function CalendarScreen() {
  const router = useRouter();
  const appointmentStore = useAppointmentManagementStore();
  const [pendingAction, setPendingAction] = useState<AppointmentActionType | null>(null);

  function handleBack() {
    router.back();
  }

  function handleOpenAction(id: string, action: AppointmentActionType) {
    appointmentStore.setSelectedId(id);
    setPendingAction(action);
  }

  function handleConfirmAction() {
    if (!pendingAction) return;
    const action = pendingAction;
    setPendingAction(null);
    router.push(`/(patient)/appointment-policy?type=${action}`);
  }

  return (
    <>
      <CalendarView
        onBack={handleBack}
        onCancelAppointment={(id) => handleOpenAction(id, 'cancel')}
        onRescheduleAppointment={(id) => handleOpenAction(id, 'reschedule')}
      />

      <AppointmentConfirmModal
        visible={pendingAction != null}
        type={pendingAction ?? 'cancel'}
        onClose={() => setPendingAction(null)}
        onConfirm={handleConfirmAction}
      />
    </>
  );
}
