import { useEffect, useState } from 'react';
import { cancelAppointment, fetchAppointments } from '../services/appointmentManagement.service';
import { useAppointmentManagementStore } from '../store/appointmentManagement.store';
import type { CancelReason, RescheduleReason } from '../types/appointmentManagement.types';

type Status = 'loading' | 'error' | 'success';

export function useAppointmentManagement() {
  const store = useAppointmentManagementStore();
  const [status, setStatus] = useState<Status>(
    store.appointments.length > 0 ? 'success' : 'loading'
  );

  const upcomingAppointment = store.appointments.find((a) => a.status === 'upcoming') ?? null;

  async function load() {
    setStatus('loading');
    try {
      const data = await fetchAppointments();
      store.setAppointments(data);
      setStatus('success');
    } catch {
      setStatus('error');
    }
  }

  useEffect(() => {
    if (store.appointments.length === 0) load();
  }, []);

  async function handleConfirmCancel() {
    if (!store.selectedId) return;
    await cancelAppointment(store.selectedId);
    store.applyCancel();
  }

  return {
    status,
    appointments: store.appointments,
    upcomingAppointment,
    selectedId: store.selectedId,
    cancelModalOpen: store.cancelModalOpen,
    rescheduleModalOpen: store.rescheduleModalOpen,
    cancelReason: store.cancelReason,
    rescheduleReason: store.rescheduleReason,
    openCancelModal: store.openCancelModal,
    openRescheduleModal: store.openRescheduleModal,
    closeModals: store.closeModals,
    setCancelReason: (r: CancelReason) => store.setCancelReason(r),
    setRescheduleReason: (r: RescheduleReason) => store.setRescheduleReason(r),
    handleConfirmCancel,
    retry: load,
  };
}
