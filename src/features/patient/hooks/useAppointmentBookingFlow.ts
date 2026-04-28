import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useAppointmentBookingStore } from '../store/appointmentBooking.store';
import {
  createBookedAppointment,
  getDoctorRecommendations,
  getDoctorSchedule,
  getNuraRecommendationMessage,
} from '../services/appointmentBooking.service';
import type {
  AppointmentBookingStep,
  AppointmentCalendarMonth,
  AppointmentTimeSlot,
  BookedAppointment,
  BookingRouteViewState,
  CalendarDayAvailability,
  DoctorAvailabilitySummary,
  DoctorFilterTab,
  DoctorRecommendation,
} from '../types/appointmentBooking.types';

type BackIntent = 'exit' | 'internal';

export interface UseAppointmentBookingFlowResult {
  step: AppointmentBookingStep;
  routeViewState: BookingRouteViewState;
  activeFilter: DoctorFilterTab;
  doctors: DoctorRecommendation[];
  selectedDoctor: DoctorRecommendation | null;
  calendarMonth: AppointmentCalendarMonth | null;
  calendarHeaderLabel: string;
  selectedDate: CalendarDayAvailability | null;
  selectedTimeSlotId: string | null;
  timeSlots: AppointmentTimeSlot[];
  bookedAppointment: BookedAppointment | null;
  nuraMessage: string;
  canMakeAppointment: boolean;
  isTimeSlotModalOpen: boolean;
  handleRetry: () => void;
  handleSelectFilter: (filter: DoctorFilterTab) => void;
  handleSelectDoctor: (doctor: DoctorRecommendation) => void;
  handleProceedToDateTime: () => void;
  handleSelectDate: (dateKey: string) => void;
  handleSelectTimeSlot: (timeSlotId: string) => void;
  handleMakeAppointment: () => void;
  handleBack: () => BackIntent;
  handleCloseTimeSlotModal: () => void;
  handleCloseSuccess: () => void;
  handleFinishBooking: (onFinish: (appointment: BookedAppointment) => void) => void;
}

const CALENDAR_MONTH_NAMES = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
] as const;

function formatCalendarHeaderLabel(isoDate: string) {
  const [yearText, monthText, dayText] = isoDate.split('-');
  const monthIndex = Number(monthText) - 1;
  const day = Number(dayText);
  return `${CALENDAR_MONTH_NAMES[monthIndex]} ${day}, ${yearText}`;
}

export function useAppointmentBookingFlow(): UseAppointmentBookingFlowResult {
  const accessSnapshot = useAppointmentBookingStore((state) => state.accessSnapshot);
  const clearAccessSnapshot = useAppointmentBookingStore((state) => state.clearAccessSnapshot);

  const [step, setStep] = useState<AppointmentBookingStep>('findingMatch');
  const [routeViewState, setRouteViewState] = useState<BookingRouteViewState>('content');
  const [activeFilter, setActiveFilter] = useState<DoctorFilterTab>('aiRecommended');
  const [doctors, setDoctors] = useState<DoctorRecommendation[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<DoctorRecommendation | null>(null);
  const [calendarMonth, setCalendarMonth] = useState<AppointmentCalendarMonth | null>(null);
  const [availabilitySummary, setAvailabilitySummary] = useState<DoctorAvailabilitySummary | null>(null);
  const [selectedDateKey, setSelectedDateKey] = useState<string | null>(null);
  const [selectedTimeSlotId, setSelectedTimeSlotId] = useState<string | null>(null);
  const [bookedAppointment, setBookedAppointment] = useState<BookedAppointment | null>(null);
  const [isTimeSlotModalOpen, setIsTimeSlotModalOpen] = useState(false);
  const matchingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const nuraMessage = accessSnapshot
    ? getNuraRecommendationMessage(accessSnapshot.matchingContext)
    : '';

  const clearMatchingTimer = useCallback(() => {
    if (matchingTimerRef.current) {
      clearTimeout(matchingTimerRef.current);
      matchingTimerRef.current = null;
    }
  }, []);

  const loadDoctors = useCallback(async (filter: DoctorFilterTab) => {
    if (!accessSnapshot) return;

    setRouteViewState('content');

    try {
      const nextDoctors = await getDoctorRecommendations(accessSnapshot.matchingContext, filter);
      setDoctors(nextDoctors);
      setSelectedDoctor((current) => {
        if (!current) return current;
        return nextDoctors.find((doctor) => doctor.id === current.id) ?? current;
      });

      if (nextDoctors.length === 0) {
        setRouteViewState('empty');
      }
    } catch {
      setRouteViewState('error');
    }
  }, [accessSnapshot]);

  const startMatching = useCallback(() => {
    clearMatchingTimer();
    setStep('findingMatch');
    setRouteViewState('content');
    setActiveFilter('aiRecommended');
    setSelectedDoctor(null);
    setCalendarMonth(null);
    setAvailabilitySummary(null);
    setSelectedDateKey(null);
    setSelectedTimeSlotId(null);
    setBookedAppointment(null);
    setIsTimeSlotModalOpen(false);

    matchingTimerRef.current = setTimeout(async () => {
      await loadDoctors('aiRecommended');
      setStep('doctorList');
    }, 2200);
  }, [clearMatchingTimer, loadDoctors]);

  useEffect(() => {
    if (!accessSnapshot) return;
    startMatching();

    return () => {
      clearMatchingTimer();
    };
  }, [accessSnapshot, clearMatchingTimer, startMatching]);

  const selectedDate = useMemo(() => {
    if (!calendarMonth || !selectedDateKey) return null;

    for (const week of calendarMonth.weeks) {
      const match = week.find((day) => day?.key === selectedDateKey);
      if (match) return match;
    }

    return null;
  }, [calendarMonth, selectedDateKey]);

  const calendarHeaderLabel = useMemo(() => {
    if (selectedDate) {
      return formatCalendarHeaderLabel(selectedDate.isoDate);
    }

    return calendarMonth?.label ?? '';
  }, [calendarMonth?.label, selectedDate]);

  const timeSlots = useMemo(() => {
    if (!selectedDateKey || !availabilitySummary) return [];
    return availabilitySummary.timeSlotsByDate[selectedDateKey] ?? [];
  }, [availabilitySummary, selectedDateKey]);

  const canMakeAppointment = Boolean(selectedDoctor && selectedDate && selectedTimeSlotId);

  const handleRetry = useCallback(() => {
    startMatching();
  }, [startMatching]);

  const handleSelectFilter = useCallback((filter: DoctorFilterTab) => {
    setActiveFilter(filter);
    void loadDoctors(filter);
  }, [loadDoctors]);

  const handleSelectDoctor = useCallback((doctor: DoctorRecommendation) => {
    setSelectedDoctor(doctor);
    setStep('doctorDetails');
  }, []);

  const handleProceedToDateTime = useCallback(async () => {
    if (!selectedDoctor) return;

    try {
      const schedule = await getDoctorSchedule(selectedDoctor.id);
      setAvailabilitySummary(schedule);
      setCalendarMonth(schedule.month);
      setSelectedDateKey(null);
      setSelectedTimeSlotId(null);
      setIsTimeSlotModalOpen(false);
      setStep('dateTime');
    } catch {
      setRouteViewState('error');
    }
  }, [selectedDoctor]);

  const handleSelectDate = useCallback((dateKey: string) => {
    setSelectedDateKey(dateKey);
    setSelectedTimeSlotId(null);
    setIsTimeSlotModalOpen(true);
  }, []);

  const handleSelectTimeSlot = useCallback((timeSlotId: string) => {
    setSelectedTimeSlotId(timeSlotId);
  }, []);

  const handleMakeAppointment = useCallback(async () => {
    if (!selectedDoctor || !selectedDate || !selectedTimeSlotId) return;

    try {
      const nextAppointment = await createBookedAppointment(
        selectedDoctor,
        selectedDate.isoDate,
        selectedTimeSlotId,
      );

      setBookedAppointment(nextAppointment);
      setIsTimeSlotModalOpen(false);
      setStep('success');
    } catch {
      setRouteViewState('error');
    }
  }, [selectedDate, selectedDoctor, selectedTimeSlotId]);

  const handleBack = useCallback((): BackIntent => {
    if (step === 'findingMatch' || step === 'doctorList') {
      clearMatchingTimer();
      return 'exit';
    }

    if (step === 'doctorDetails') {
      setStep('doctorList');
      return 'internal';
    }

    if (step === 'success') {
      setStep('dateTime');
      return 'internal';
    }

    if (step === 'dateTime' && isTimeSlotModalOpen) {
      setIsTimeSlotModalOpen(false);
      return 'internal';
    }

    if (step === 'dateTime') {
      setStep('doctorDetails');
      return 'internal';
    }

    return 'internal';
  }, [clearMatchingTimer, isTimeSlotModalOpen, step]);

  const handleCloseTimeSlotModal = useCallback(() => {
    setIsTimeSlotModalOpen(false);
  }, []);

  const handleCloseSuccess = useCallback(() => {
    setStep('dateTime');
  }, []);

  const handleFinishBooking = useCallback((onFinish: (appointment: BookedAppointment) => void) => {
    if (!bookedAppointment) return;

    clearAccessSnapshot();
    onFinish(bookedAppointment);
  }, [bookedAppointment, clearAccessSnapshot]);

  return {
    step,
    routeViewState,
    activeFilter,
    doctors,
    selectedDoctor,
    calendarMonth,
    calendarHeaderLabel,
    selectedDate,
    selectedTimeSlotId,
    timeSlots,
    bookedAppointment,
    nuraMessage,
    canMakeAppointment,
    isTimeSlotModalOpen,
    handleRetry,
    handleSelectFilter,
    handleSelectDoctor,
    handleProceedToDateTime,
    handleSelectDate,
    handleSelectTimeSlot,
    handleMakeAppointment,
    handleBack,
    handleCloseTimeSlotModal,
    handleCloseSuccess,
    handleFinishBooking,
  };
}
