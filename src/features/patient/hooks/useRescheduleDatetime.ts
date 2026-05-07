import { useEffect, useState } from 'react';
import {
  fetchRescheduleSchedule,
  rescheduleAppointment,
} from '../services/appointmentManagement.service';
import { useAppointmentManagementStore } from '../store/appointmentManagement.store';
import type { AppointmentCalendarMonth, AppointmentTimeSlot } from '../types/appointmentBooking.types';

type Status = 'loading' | 'error' | 'success';

export function useRescheduleDatetime() {
  const store = useAppointmentManagementStore();
  const [status, setStatus] = useState<Status>('loading');
  const [calendarMonth, setCalendarMonth] = useState<AppointmentCalendarMonth | null>(null);
  const [timeSlotsByDate, setTimeSlotsByDate] = useState<Record<string, AppointmentTimeSlot[]>>({});

  async function loadSchedule() {
    if (!store.selectedId) {
      setCalendarMonth(null);
      setTimeSlotsByDate({});
      setStatus('error');
      return;
    }

    setStatus('loading');
    try {
      const schedule = await fetchRescheduleSchedule(store.selectedId);
      setCalendarMonth(schedule.month);
      setTimeSlotsByDate(schedule.timeSlotsByDate);
      setStatus('success');
    } catch {
      setCalendarMonth(null);
      setTimeSlotsByDate({});
      setStatus('error');
    }
  }

  useEffect(() => {
    loadSchedule();
  }, [store.selectedId]);

  const timeSlots = store.selectedDate
    ? (timeSlotsByDate[store.selectedDate] ?? [])
    : [];

  async function handleMakeAppointment(onSuccess: () => void) {
    if (!store.selectedId || !store.selectedDate || !store.selectedTimeSlotId) return;
    await rescheduleAppointment(store.selectedId, store.selectedDate, store.selectedTimeSlotId);
    store.applyReschedule(store.selectedDate, store.selectedTimeSlotId);
    onSuccess();
  }

  return {
    status,
    hasSelectedAppointment: !!store.selectedId,
    calendarMonth,
    timeSlots,
    selectedDate: store.selectedDate,
    selectedTimeSlotId: store.selectedTimeSlotId,
    canMakeAppointment: !!store.selectedDate && !!store.selectedTimeSlotId,
    setSelectedDate: store.setSelectedDate,
    setSelectedTimeSlot: store.setSelectedTimeSlot,
    handleMakeAppointment,
    retry: loadSchedule,
  };
}
