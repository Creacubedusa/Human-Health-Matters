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
  const [cursor, setCursor] = useState<{ year: number; month: number } | null>(null);

  async function loadSchedule(next?: { year: number; month: number }) {
    if (!store.selectedId) {
      setCalendarMonth(null);
      setTimeSlotsByDate({});
      setStatus('error');
      return;
    }

    setStatus('loading');
    try {
      const now = new Date();
      const requested = next ?? cursor ?? { year: now.getFullYear(), month: now.getMonth() + 1 };
      const schedule = await fetchRescheduleSchedule(store.selectedId, requested);
      setCalendarMonth(schedule.month);
      setTimeSlotsByDate(schedule.timeSlotsByDate);
      setCursor(requested);
      setStatus('success');
    } catch {
      setCalendarMonth(null);
      setTimeSlotsByDate({});
      setStatus('error');
    }
  }

  useEffect(() => {
    void loadSchedule();
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

  async function handlePrevMonth() {
    if (!cursor) return;
    const now = new Date();
    const minYear = now.getFullYear();
    const minMonth = now.getMonth() + 1;

    let year = cursor.year;
    let month = cursor.month - 1;
    if (month < 1) {
      month = 12;
      year -= 1;
    }
    if (year < minYear || (year === minYear && month < minMonth)) return;
    store.setSelectedDate(null);
    store.setSelectedTimeSlot(null);
    await loadSchedule({ year, month });
  }

  async function handleNextMonth() {
    if (!cursor) return;
    let year = cursor.year;
    let month = cursor.month + 1;
    if (month > 12) {
      month = 1;
      year += 1;
    }
    store.setSelectedDate(null);
    store.setSelectedTimeSlot(null);
    await loadSchedule({ year, month });
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
    handlePrevMonth,
    handleNextMonth,
    retry: loadSchedule,
  };
}
