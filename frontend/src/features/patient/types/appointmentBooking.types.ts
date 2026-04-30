export type DoctorMatchUrgency = 'emergency' | 'urgent' | 'moderate' | 'low';
export type DoctorFilterTab = 'aiRecommended' | 'availableNow' | 'topRated';
export type AppointmentBookingStep =
  | 'findingMatch'
  | 'doctorList'
  | 'doctorDetails'
  | 'dateTime'
  | 'success';
export type BookingRouteViewState = 'content' | 'error' | 'empty';
export type AvailabilityDotTone = 'blue' | 'green' | 'yellow';

export interface DoctorMatchContext {
  symptoms: string[];
  history: string[];
  urgency: DoctorMatchUrgency;
  coverageStatus: 'eligible';
  donorFund: 'available' | 'unavailable';
}

export interface DoctorRecommendation {
  id: string;
  name: string;
  specialty: string;
  avatarUri: string;
  matchScore: number;
  rating: number;
  reviewCount: number;
  donorFunded: boolean;
  aiReason: string;
  isAvailableNow: boolean;
  patientsLabel: string;
  experienceLabel: string;
  about: string;
  availabilityRange: string;
}

export interface CalendarDayAvailability {
  key: string;
  isoDate: string;
  dayNumber: number;
  isCurrentMonth: boolean;
  isAvailable: boolean;
  availabilityDots: AvailabilityDotTone[];
}

export interface AppointmentCalendarMonth {
  key: string;
  label: string;
  weeks: Array<Array<CalendarDayAvailability | null>>;
}

export interface AppointmentTimeSlot {
  id: string;
  label: string;
  available: boolean;
}

export interface DoctorAvailabilitySummary {
  month: AppointmentCalendarMonth;
  timeSlotsByDate: Record<string, AppointmentTimeSlot[]>;
}

export interface BookedAppointment {
  doctorId: string;
  doctorName: string;
  specialty: string;
  isoDate: string;
  formattedDate: string;
  timeLabel: string;
}

export interface AppointmentAccessSnapshot {
  canProceed: true;
  matchingContext: DoctorMatchContext;
  coverageSummary: {
    consultationCost: number;
    insurancePays: number;
    donorCovers: number;
    finalYouPay: number;
    donorAvailableAmount: number;
  };
}

export const DOCTOR_FILTER_TAB_OPTIONS: Array<{ labelKey: string; value: DoctorFilterTab }> = [
  { labelKey: 'appointmentBooking.filters.aiRecommended', value: 'aiRecommended' },
  { labelKey: 'appointmentBooking.filters.availableNow', value: 'availableNow' },
  { labelKey: 'appointmentBooking.filters.topRated', value: 'topRated' },
];
