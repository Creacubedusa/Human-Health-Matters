import { create } from 'zustand';
import type {
  DoctorCancelReason,
  DoctorManagedAppointment,
  DoctorRescheduleReason,
} from '../types/doctorAppointments.types';

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
] as const;

function formatAppointmentDate(isoDate: string) {
  const [yearText, monthText, dayText] = isoDate.split('-');
  const year = Number(yearText);
  const monthIndex = Number(monthText) - 1;
  const day = Number(dayText);
  if (!year || monthIndex < 0 || monthIndex >= MONTH_NAMES.length || !day) return isoDate;
  return `${MONTH_NAMES[monthIndex]} ${day}, ${year}`;
}

interface DoctorAppointmentsState {
  appointments: DoctorManagedAppointment[];
  selectedId: string | null;
  cancelModalOpen: boolean;
  rescheduleModalOpen: boolean;
  cancelReason: DoctorCancelReason | null;
  rescheduleReason: DoctorRescheduleReason | null;
  selectedDate: string | null;
  selectedTimeSlotId: string | null;

  setAppointments: (data: DoctorManagedAppointment[]) => void;
  setSelectedId: (id: string | null) => void;
  openCancelModal: (id: string) => void;
  openRescheduleModal: (id: string) => void;
  closeModals: () => void;
  setCancelReason: (reason: DoctorCancelReason) => void;
  setRescheduleReason: (reason: DoctorRescheduleReason) => void;
  setSelectedDate: (isoDate: string | null) => void;
  setSelectedTimeSlot: (id: string | null) => void;
  applyCancel: () => void;
  applyReschedule: (isoDate: string, timeSlotId: string) => void;
  completeAppointment: (id: string) => void;
}

export const useDoctorAppointmentsStore = create<DoctorAppointmentsState>((set) => ({
  appointments: [],
  selectedId: null,
  cancelModalOpen: false,
  rescheduleModalOpen: false,
  cancelReason: null,
  rescheduleReason: null,
  selectedDate: null,
  selectedTimeSlotId: null,

  setAppointments: (data) => set({ appointments: data }),
  setSelectedId: (id) => set({ selectedId: id }),
  openCancelModal: (id) => set({ selectedId: id, cancelModalOpen: true }),
  openRescheduleModal: (id) => set({ selectedId: id, rescheduleModalOpen: true }),
  closeModals: () => set({ cancelModalOpen: false, rescheduleModalOpen: false }),
  setCancelReason: (reason) => set({ cancelReason: reason }),
  setRescheduleReason: (reason) => set({ rescheduleReason: reason }),
  setSelectedDate: (isoDate) => set({ selectedDate: isoDate, selectedTimeSlotId: null }),
  setSelectedTimeSlot: (id) => set({ selectedTimeSlotId: id }),
  applyCancel: () =>
    set((state) => ({
      appointments: state.appointments.map((a) =>
        a.id === state.selectedId
          ? { ...a, status: 'cancelled', canCancel: false, canReschedule: false }
          : a,
      ),
      cancelModalOpen: false,
      cancelReason: null,
      selectedId: null,
    })),
  applyReschedule: (isoDate, timeSlotId) =>
    set((state) => ({
      appointments: state.appointments.map((a) =>
        a.id === state.selectedId
          ? { ...a, status: 'upcoming', date: formatAppointmentDate(isoDate), time: timeSlotId }
          : a,
      ),
      rescheduleModalOpen: false,
      rescheduleReason: null,
      selectedDate: null,
      selectedTimeSlotId: null,
      selectedId: null,
    })),
  completeAppointment: (id) =>
    set((state) => ({
      appointments: state.appointments.map((appointment) =>
        appointment.id !== id
          ? appointment
          : {
              ...appointment,
              status: 'completed',
              canCancel: false,
              canReschedule: false,
            },
      ),
      selectedId: state.selectedId === id ? null : state.selectedId,
    })),
}));
