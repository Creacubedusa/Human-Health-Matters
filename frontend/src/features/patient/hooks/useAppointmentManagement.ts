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
  const [refreshing, setRefreshing] = useState(false);

  const upcomingAppointment = store.appointments.find((a) => a.status === 'upcoming') ?? null;

  async function load(options?: { silent?: boolean }) {
    if (!options?.silent) setStatus('loading');
    try {
      const data = await fetchAppointments();
      store.setAppointments(data);
      setStatus('success');
    } catch {
      if (!options?.silent) setStatus('error');
    }
  }

  async function refresh() {
    setRefreshing(true);
    try {
      await load({ silent: true });
    } finally {
      setRefreshing(false);
    }
  }

  useEffect(() => {
    if (store.appointments.length === 0) {
      void load();
    } else {
      void load({ silent: true });
    }
  }, []);

  async function handleConfirmCancel() {
    if (!store.selectedId) return;
    await cancelAppointment(store.selectedId);
    store.applyCancel();
  }

  return {
    status,
    refreshing,
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
    refresh,
  };
}
