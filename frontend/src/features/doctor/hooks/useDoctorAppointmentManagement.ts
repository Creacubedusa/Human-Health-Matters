import { useEffect, useState } from 'react';
import { fetchDoctorManagedAppointments } from '../services/doctor.service';
import { useDoctorAppointmentsStore } from '../store/doctorAppointments.store';
import type { DoctorCancelReason, DoctorRescheduleReason } from '../types/doctorAppointments.types';

type Status = 'loading' | 'error' | 'success';

export function useDoctorAppointmentManagement() {
  const store = useDoctorAppointmentsStore();
  const [status, setStatus] = useState<Status>(
    store.appointments.length > 0 ? 'success' : 'loading',
  );

  const upcomingAppointment =
    store.appointments.find((a) => a.status === 'upcoming') ?? null;

  async function load(options?: { silent?: boolean }) {
    if (!options?.silent) {
      setStatus('loading');
    }
    try {
      const data = await fetchDoctorManagedAppointments();
      store.setAppointments(data);
      setStatus('success');
    } catch {
      setStatus('error');
    }
  }

  useEffect(() => {
    void load({ silent: store.appointments.length > 0 });
  }, []);

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
    setCancelReason: (r: DoctorCancelReason) => store.setCancelReason(r),
    setRescheduleReason: (r: DoctorRescheduleReason) => store.setRescheduleReason(r),
    retry: () => {
      void load();
    },
  };
}
