import type { CoverageResult } from '../types/insuranceCoverage.types';
import type { TriageResult } from '../types/triage.types';
import type {
  AppointmentAccessSnapshot,
  AppointmentCalendarMonth,
  AppointmentTimeSlot,
  BookedAppointment,
  CalendarDayAvailability,
  DoctorAvailabilitySummary,
  DoctorFilterTab,
  DoctorMatchContext,
  DoctorRecommendation,
} from '../types/appointmentBooking.types';
import { http } from '@shared/api/http';
import { addMinutes, parse } from 'date-fns';

const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
] as const;

const DEFAULT_CONTEXT: DoctorMatchContext = {
  symptoms: ['chest tightness', 'fatigue'],
  history: ['hypertension'],
  urgency: 'urgent',
  coverageStatus: 'eligible',
  donorFund: 'available',
};

const DOCTORS: DoctorRecommendation[] = [
  {
    id: 'doctor-paul-grant',
    name: 'Dr. Paul Grant',
    specialty: 'Cardiologist',
    avatarUri: 'https://i.pravatar.cc/160?img=12',
    matchScore: 98,
    rating: 4.9,
    reviewCount: 37,
    donorFunded: true,
    aiReason: 'Matched to your chest tightness & hypertension history',
    isAvailableNow: true,
    patientsLabel: '200+',
    experienceLabel: '20 yr',
    about:
      'MBBS, Ph.D., Fellow, International College of Surgeons. Ex- Professor & Head of Department Department of Cardiology Harvard University',
    availabilityRange: '9 AM - 9 PM',
  },
  {
    id: 'doctor-amina-osei',
    name: 'Dr. Amina Osei',
    specialty: 'General Practice',
    avatarUri: 'https://i.pravatar.cc/160?img=32',
    matchScore: 86,
    rating: 4.6,
    reviewCount: 37,
    donorFunded: true,
    aiReason: 'Strong generalist — ideal for triage follow-up',
    isAvailableNow: true,
    patientsLabel: '140+',
    experienceLabel: '12 yr',
    about:
      'MBChB, MSc Family Medicine. Community-first clinician with broad acute-care experience and a focus on same-day follow-up for urgent triage cases.',
    availabilityRange: '9 AM - 7 PM',
  },
  {
    id: 'doctor-daniel-cole',
    name: 'Dr. Daniel Cole',
    specialty: 'Internal Medicine',
    avatarUri: 'https://i.pravatar.cc/160?img=15',
    matchScore: 81,
    rating: 4.8,
    reviewCount: 37,
    donorFunded: true,
    aiReason: 'Internal medicine expertise aligns with multi-system symptoms',
    isAvailableNow: true,
    patientsLabel: '180+',
    experienceLabel: '16 yr',
    about:
      'MD, FACP. Internal medicine consultant with deep experience in hypertension management, fatigue workups, and complex symptom review.',
    availabilityRange: '10 AM - 8 PM',
  },
];

const AUGUST_2025_DOTS: Record<number, Array<CalendarDayAvailability['availabilityDots'][number]>> = {
  1: ['blue', 'blue'],
  2: ['green', 'blue'],
  3: ['yellow', 'blue'],
  5: ['blue', 'blue'],
  10: ['blue', 'blue'],
  11: ['blue'],
  22: ['blue', 'blue'],
  24: ['green', 'blue'],
  25: ['blue'],
  30: ['yellow', 'blue'],
  31: ['blue', 'blue'],
};

const TIME_SLOTS: AppointmentTimeSlot[] = [
  { id: '09:30 AM', label: '09:30 AM', available: true },
  { id: '10:30 AM', label: '10:30 AM', available: true },
  { id: '11:00 AM', label: '11:00 AM', available: true },
  { id: '11:30 AM', label: '11:30 AM', available: true },
  { id: '12:00 AM', label: '12:00 AM', available: true },
  { id: '12:30 PM', label: '12:30 PM', available: true },
];

function pad(value: number) {
  return value.toString().padStart(2, '0');
}

function createIsoDate(year: number, monthIndex: number, day: number) {
  return `${year}-${pad(monthIndex + 1)}-${pad(day)}`;
}

function createTimeSlots() {
  return TIME_SLOTS.map((slot) => ({ ...slot }));
}

function buildTimeSlotsByDate(year: number, monthIndex: number) {
  return Object.keys(AUGUST_2025_DOTS).reduce<Record<string, AppointmentTimeSlot[]>>((accumulator, dayText) => {
    const dayNumber = Number(dayText);
    accumulator[createIsoDate(year, monthIndex, dayNumber)] = createTimeSlots();
    return accumulator;
  }, {});
}

function buildMonth(year: number, monthIndex: number): AppointmentCalendarMonth {
  const firstDay = new Date(year, monthIndex, 1);
  const lastDay = new Date(year, monthIndex + 1, 0);
  const startWeekday = firstDay.getDay();
  const totalDays = lastDay.getDate();
  const cells: Array<CalendarDayAvailability | null> = [];

  for (let i = 0; i < startWeekday; i += 1) {
    cells.push(null);
  }

  for (let day = 1; day <= totalDays; day += 1) {
    cells.push({
      key: createIsoDate(year, monthIndex, day),
      isoDate: createIsoDate(year, monthIndex, day),
      dayNumber: day,
      isCurrentMonth: true,
      isAvailable: Boolean(AUGUST_2025_DOTS[day]),
      availabilityDots: AUGUST_2025_DOTS[day] ?? [],
    });
  }

  while (cells.length % 7 !== 0) {
    cells.push(null);
  }

  const weeks: Array<Array<CalendarDayAvailability | null>> = [];
  for (let index = 0; index < cells.length; index += 7) {
    weeks.push(cells.slice(index, index + 7));
  }

  return {
    key: `${year}-${pad(monthIndex + 1)}`,
    label: `${MONTH_NAMES[monthIndex].slice(0, 3)} ${year}`,
    weeks,
  };
}

function formatLongDate(isoDate: string) {
  const [yearText, monthText, dayText] = isoDate.split('-');
  const year = Number(yearText);
  const monthIndex = Number(monthText) - 1;
  const day = Number(dayText);
  return `${MONTH_NAMES[monthIndex]} ${day}, ${year}`;
}

function buildRecommendedSummary(context: DoctorMatchContext) {
  const symptoms = context.symptoms.slice(0, 2).join(', ');
  const history = context.history[0] ? `${context.history[0]} history` : 'clinical history';

  return `Based on your triage — ${symptoms}, and your ${history} — I've ranked 3 doctors by match quality. Dr. Osei is your strongest match and is available right now.`;
}

export function getFallbackDoctorMatchContext() {
  return DEFAULT_CONTEXT;
}

export function createAppointmentAccessSnapshot(
  coverageResult: CoverageResult,
  triageResult?: TriageResult | null,
): AppointmentAccessSnapshot {
  return {
    canProceed: true,
    matchingContext: triageResult?.matchingContext ?? getFallbackDoctorMatchContext(),
    coverageSummary: {
      consultationCost: coverageResult.consultationCost,
      insurancePays: coverageResult.insurancePays,
      donorCovers: coverageResult.donorCovers,
      finalYouPay: coverageResult.finalYouPay,
      donorAvailableAmount: coverageResult.donorAvailableAmount,
    },
  };
}

export function getNuraRecommendationMessage(context: DoctorMatchContext) {
  return buildRecommendedSummary(context);
}

export async function getDoctorRecommendations(
  context: DoctorMatchContext,
  filter: DoctorFilterTab,
): Promise<DoctorRecommendation[]> {
  void context;
  const res = await http.get<DoctorRecommendation[]>('/doctors', { params: { filter } });
  return res.data;
}

export async function getDoctorSchedule(_doctorId: string): Promise<DoctorAvailabilitySummary> {
  const res = await http.get<DoctorAvailabilitySummary>(`/doctors/${_doctorId}/schedule`);
  return res.data;
}

export async function createBookedAppointment(
  doctor: DoctorRecommendation,
  selectedDateIso: string,
  selectedTimeLabel: string,
): Promise<BookedAppointment> {
  const startsAt = parse(
    `${selectedDateIso} ${selectedTimeLabel}`,
    'yyyy-MM-dd hh:mm a',
    new Date(),
  );
  const endsAt = addMinutes(startsAt, 30);

  await http.post('/appointments', {
    doctorId: doctor.id,
    startsAt: startsAt.toISOString(),
    endsAt: endsAt.toISOString(),
  });

  return {
    doctorId: doctor.id,
    doctorName: doctor.name,
    specialty: doctor.specialty,
    isoDate: selectedDateIso,
    formattedDate: formatLongDate(selectedDateIso),
    timeLabel: selectedTimeLabel,
  };
}
