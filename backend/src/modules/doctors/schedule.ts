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

type AvailabilityDotTone = 'blue' | 'green' | 'yellow';
type CalendarDayAvailability = {
  key: string;
  isoDate: string;
  dayNumber: number;
  isCurrentMonth: boolean;
  isAvailable: boolean;
  availabilityDots: AvailabilityDotTone[];
};

type AppointmentCalendarMonth = {
  key: string;
  label: string;
  weeks: Array<Array<CalendarDayAvailability | null>>;
};

type AppointmentTimeSlot = { id: string; label: string; available: boolean };

export type DoctorAvailabilitySummary = {
  month: AppointmentCalendarMonth;
  timeSlotsByDate: Record<string, AppointmentTimeSlot[]>;
};

function dotsForDay(day: number): AvailabilityDotTone[] {
  const mod = day % 6;
  if (mod === 0) return ['yellow', 'blue'];
  if (mod === 1) return ['green', 'blue'];
  if (mod === 2) return ['blue', 'blue'];
  if (mod === 3) return ['blue'];
  return ['blue', 'green'];
}

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

function buildAvailabilityDays(year: number, monthIndex: number) {
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfMonth = new Date(year, monthIndex, 1);
  const endOfMonth = new Date(year, monthIndex + 1, 0);

  const isCurrentMonth =
    year === startOfToday.getFullYear() && monthIndex === startOfToday.getMonth();
  const start = isCurrentMonth ? startOfToday : startOfMonth;
  if (start.getTime() > endOfMonth.getTime()) return [];

  const days: number[] = [];
  for (let d = new Date(start); d.getMonth() === monthIndex; d.setDate(d.getDate() + 1)) {
    days.push(d.getDate());
  }
  return days;
}

function buildTimeSlotsByDate(year: number, monthIndex: number) {
  return buildAvailabilityDays(year, monthIndex).reduce<Record<string, AppointmentTimeSlot[]>>((acc, day) => {
    acc[createIsoDate(year, monthIndex, day)] = TIME_SLOTS.map((s) => ({
      ...s,
    }));
    return acc;
  }, {});
}

function buildMonth(
  year: number,
  monthIndex: number,
): AppointmentCalendarMonth {
  const firstDay = new Date(year, monthIndex, 1);
  const lastDay = new Date(year, monthIndex + 1, 0);
  const startWeekday = firstDay.getDay();
  const totalDays = lastDay.getDate();
  const cells: Array<CalendarDayAvailability | null> = [];

  for (let i = 0; i < startWeekday; i += 1) cells.push(null);

  const availableDays = new Set(buildAvailabilityDays(year, monthIndex));

  for (let day = 1; day <= totalDays; day += 1) {
    const isAvailable = availableDays.has(day);
    cells.push({
      key: createIsoDate(year, monthIndex, day),
      isoDate: createIsoDate(year, monthIndex, day),
      dayNumber: day,
      isCurrentMonth: true,
      isAvailable,
      availabilityDots: isAvailable ? dotsForDay(day) : [],
    });
  }

  while (cells.length % 7 !== 0) cells.push(null);

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

export function buildDemoSchedule(): DoctorAvailabilitySummary {
  const now = new Date();
  return buildScheduleForMonth(now.getFullYear(), now.getMonth());
}

export function buildScheduleForMonth(
  year: number,
  monthIndex: number,
): DoctorAvailabilitySummary {
  const now = new Date();
  void now;
  return {
    month: buildMonth(year, monthIndex),
    timeSlotsByDate: buildTimeSlotsByDate(year, monthIndex),
  };
}
