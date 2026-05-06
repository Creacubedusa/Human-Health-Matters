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

export type AvailabilityDotTone = 'blue' | 'green' | 'yellow';
export type DoctorAvailabilityWeekday =
  | 'sun'
  | 'mon'
  | 'tue'
  | 'wed'
  | 'thu'
  | 'fri'
  | 'sat';

export type DoctorAvailabilitySlot = {
  id: string;
  startTime: string;
  endTime: string;
};

export type DoctorAvailabilityDay = {
  key: DoctorAvailabilityWeekday;
  label: string;
  slots: DoctorAvailabilitySlot[];
};

export type DoctorAvailabilitySettings = {
  fromDate: string;
  toDate: string;
  timeZone?: string;
  appointmentDurationMinutes: 15 | 30 | 45 | 60;
  days: DoctorAvailabilityDay[];
  bookingLimits: {
    bufferEnabled: boolean;
    bufferDurationMinutes: 10 | 15 | 30 | 45;
    dailyLimitEnabled: boolean;
    dailyLimit: string;
  };
};

type CalendarDayAvailability = {
  key: string;
  isoDate: string;
  dayNumber: number;
  isCurrentMonth: boolean;
  isAvailable: boolean;
  availabilityDots: AvailabilityDotTone[];
  appointmentCountLabel: string | null;
};

type AppointmentCalendarMonth = {
  key: string;
  label: string;
  weeks: Array<Array<CalendarDayAvailability | null>>;
};

type AppointmentTimeSlot = { id: string; label: string; available: boolean };

export type DoctorAvailabilitySummary = {
  hasAvailability: boolean;
  month: AppointmentCalendarMonth;
  timeSlotsByDate: Record<string, AppointmentTimeSlot[]>;
};

export type ScheduleAppointment = {
  id?: string;
  startsAt: Date;
  endsAt: Date;
  status: 'UPCOMING' | 'COMPLETED' | 'CANCELLED';
};

const WEEKDAY_KEYS: DoctorAvailabilityWeekday[] = [
  'sun',
  'mon',
  'tue',
  'wed',
  'thu',
  'fri',
  'sat',
];

function pad(value: number) {
  return value.toString().padStart(2, '0');
}

function createIsoDate(year: number, monthIndex: number, day: number) {
  return `${year}-${pad(monthIndex + 1)}-${pad(day)}`;
}

function compareDateKeys(left: string, right: string) {
  return left.localeCompare(right);
}

function getTimeZoneOrDefault(timeZone?: string) {
  return timeZone?.trim() || 'UTC';
}

function getZonedParts(date: Date, timeZone: string) {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).formatToParts(date);

  return {
    year: Number(parts.find((part) => part.type === 'year')?.value ?? '1970'),
    month: Number(parts.find((part) => part.type === 'month')?.value ?? '01'),
    day: Number(parts.find((part) => part.type === 'day')?.value ?? '01'),
    hour: Number(parts.find((part) => part.type === 'hour')?.value ?? '00'),
    minute: Number(parts.find((part) => part.type === 'minute')?.value ?? '00'),
  };
}

function getDateKeyInTimeZone(date: Date, timeZone: string) {
  const parts = getZonedParts(date, timeZone);
  return `${parts.year}-${pad(parts.month)}-${pad(parts.day)}`;
}

function getMinutesInTimeZone(date: Date, timeZone: string) {
  const parts = getZonedParts(date, timeZone);
  return parts.hour * 60 + parts.minute;
}

function parseDateKey(value: string) {
  const [year, month, day] = value.split('-').map(Number);
  return { year, month, day };
}

function utcDateFromDateKey(value: string) {
  const { year, month, day } = parseDateKey(value);
  return new Date(Date.UTC(year, (month || 1) - 1, day || 1, 0, 0, 0, 0));
}

function zonedDateTimeToUtc(
  dateKey: string,
  minutes: number,
  timeZone: string,
) {
  const { year, month, day } = parseDateKey(dateKey);
  const hour = Math.floor(minutes / 60);
  const minute = minutes % 60;
  const desired = Date.UTC(year, month - 1, day, hour, minute, 0, 0);
  let guess = new Date(desired);

  for (let iteration = 0; iteration < 4; iteration += 1) {
    const parts = getZonedParts(guess, timeZone);
    const actual = Date.UTC(
      parts.year,
      parts.month - 1,
      parts.day,
      parts.hour,
      parts.minute,
      0,
      0,
    );
    const diff = desired - actual;
    if (diff === 0) return guess;
    guess = new Date(guess.getTime() + diff);
  }

  return guess;
}

function timeToMinutes(value: string) {
  const [hour, minute] = value.split(':').map(Number);
  return (hour || 0) * 60 + (minute || 0);
}

function minutesToLabel(totalMinutes: number) {
  const hours24 = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  const period = hours24 >= 12 ? 'PM' : 'AM';
  const hours12 = hours24 % 12 === 0 ? 12 : hours24 % 12;
  return `${String(hours12).padStart(2, '0')}:${String(minutes).padStart(2, '0')} ${period}`;
}

function weekdayKeyForDate(dateKey: string, timeZone: string): DoctorAvailabilityWeekday {
  const utcDate = utcDateFromDateKey(dateKey);
  const weekdayText = new Intl.DateTimeFormat('en-US', {
    timeZone,
    weekday: 'short',
  }).format(utcDate).toLowerCase();

  if (weekdayText.startsWith('sun')) return 'sun';
  if (weekdayText.startsWith('mon')) return 'mon';
  if (weekdayText.startsWith('tue')) return 'tue';
  if (weekdayText.startsWith('wed')) return 'wed';
  if (weekdayText.startsWith('thu')) return 'thu';
  if (weekdayText.startsWith('fri')) return 'fri';
  return 'sat';
}

function buildEmptyMonth(year: number, monthIndex: number): AppointmentCalendarMonth {
  const firstDay = new Date(year, monthIndex, 1);
  const lastDay = new Date(year, monthIndex + 1, 0);
  const startWeekday = firstDay.getDay();
  const totalDays = lastDay.getDate();
  const cells: Array<CalendarDayAvailability | null> = [];

  for (let i = 0; i < startWeekday; i += 1) cells.push(null);

  for (let day = 1; day <= totalDays; day += 1) {
    const isoDate = createIsoDate(year, monthIndex, day);
    cells.push({
      key: isoDate,
      isoDate,
      dayNumber: day,
      isCurrentMonth: true,
      isAvailable: false,
      availabilityDots: [],
      appointmentCountLabel: null,
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

export function parseDoctorAvailabilitySettings(
  value: unknown,
): DoctorAvailabilitySettings | null {
  if (!value || typeof value !== 'object') return null;
  const candidate = value as Partial<DoctorAvailabilitySettings>;
  if (
    typeof candidate.fromDate !== 'string' ||
    typeof candidate.toDate !== 'string' ||
    typeof candidate.appointmentDurationMinutes !== 'number' ||
    !Array.isArray(candidate.days) ||
    !candidate.bookingLimits
  ) {
    return null;
  }

  return candidate as DoctorAvailabilitySettings;
}

export function doctorHasAvailability(
  settings: DoctorAvailabilitySettings | null | undefined,
): settings is DoctorAvailabilitySettings {
  if (!settings) return false;
  return settings.days.some((day) => day.slots.length > 0);
}

function getUpcomingAppointments(appointments: ScheduleAppointment[]) {
  return appointments.filter((appointment) => appointment.status === 'UPCOMING');
}

function createDots(count: number): AvailabilityDotTone[] {
  if (count <= 0) return [];
  if (count === 1) return ['blue'];
  if (count === 2) return ['blue', 'green'];
  return ['blue', 'green', 'yellow'];
}

function createCountLabel(count: number) {
  if (count <= 0) return null;
  if (count <= 3) return null;
  return '3+';
}

function slotsForDay(
  settings: DoctorAvailabilitySettings,
  isoDate: string,
  appointments: ScheduleAppointment[],
) {
  const timeZone = getTimeZoneOrDefault(settings.timeZone);
  const weekday = weekdayKeyForDate(isoDate, timeZone);
  const dayConfig = settings.days.find((day) => day.key === weekday);
  if (!dayConfig || dayConfig.slots.length === 0) return [];

  const dayAppointments = getUpcomingAppointments(appointments).filter(
    (appointment) => getDateKeyInTimeZone(appointment.startsAt, timeZone) === isoDate,
  );

  const limitReached =
    settings.bookingLimits.dailyLimitEnabled &&
    Number(settings.bookingLimits.dailyLimit || '0') > 0 &&
    dayAppointments.length >= Number(settings.bookingLimits.dailyLimit);

  const buffer = settings.bookingLimits.bufferEnabled
    ? settings.bookingLimits.bufferDurationMinutes
    : 0;

  const slots: AppointmentTimeSlot[] = [];
  for (const slot of dayConfig.slots) {
    let startMinutes = timeToMinutes(slot.startTime);
    const endMinutes = timeToMinutes(slot.endTime);

    while (startMinutes + settings.appointmentDurationMinutes <= endMinutes) {
      const appointmentStart = zonedDateTimeToUtc(
        isoDate,
        startMinutes,
        timeZone,
      );
      const appointmentEnd = new Date(
        appointmentStart.getTime() + settings.appointmentDurationMinutes * 60_000,
      );

      const isBooked = dayAppointments.some((appointment) => {
        const appointmentStartsAt = appointment.startsAt.getTime();
        const appointmentEndsAt = appointment.endsAt.getTime();
        const bufferedStart = appointmentStartsAt - buffer * 60_000;
        const bufferedEnd = appointmentEndsAt + buffer * 60_000;
        return appointmentStart.getTime() < bufferedEnd && appointmentEnd.getTime() > bufferedStart;
      });

      slots.push({
        id: minutesToLabel(startMinutes),
        label: minutesToLabel(startMinutes),
        available: !isBooked && !limitReached,
      });

      startMinutes += settings.appointmentDurationMinutes;
    }
  }

  return slots;
}

function buildTimeSlotsByDate(
  year: number,
  monthIndex: number,
  settings: DoctorAvailabilitySettings,
  appointments: ScheduleAppointment[],
) {
  const timeZone = getTimeZoneOrDefault(settings.timeZone);
  const monthStartKey = createIsoDate(year, monthIndex, 1);
  const monthEndKey = createIsoDate(year, monthIndex, new Date(year, monthIndex + 1, 0).getDate());
  const todayKey = getDateKeyInTimeZone(new Date(), timeZone);
  const startKey = [settings.fromDate, monthStartKey, todayKey].sort(compareDateKeys).at(-1) ?? todayKey;
  const endCandidates = [settings.toDate, monthEndKey].sort(compareDateKeys);
  const endKey = endCandidates[0] ?? monthEndKey;

  if (compareDateKeys(startKey, endKey) > 0) return {};

  const slotsByDate: Record<string, AppointmentTimeSlot[]> = {};
  for (let date = utcDateFromDateKey(startKey); compareDateKeys(getDateKeyInTimeZone(date, 'UTC'), endKey) <= 0; date.setUTCDate(date.getUTCDate() + 1)) {
    const isoDate = getDateKeyInTimeZone(date, 'UTC');
    const nextSlots = slotsForDay(settings, isoDate, appointments);
    if (nextSlots.length > 0) {
      slotsByDate[isoDate] = nextSlots;
    }
  }

  return slotsByDate;
}

function buildMonth(
  year: number,
  monthIndex: number,
  settings: DoctorAvailabilitySettings,
  appointments: ScheduleAppointment[],
): AppointmentCalendarMonth {
  const month = buildEmptyMonth(year, monthIndex);
  const slotsByDate = buildTimeSlotsByDate(year, monthIndex, settings, appointments);
  const appointmentCounts = getUpcomingAppointments(appointments).reduce<Record<string, number>>(
    (accumulator, appointment) => {
      const key = getDateKeyInTimeZone(
        appointment.startsAt,
        getTimeZoneOrDefault(settings.timeZone),
      );
      accumulator[key] = (accumulator[key] ?? 0) + 1;
      return accumulator;
    },
    {},
  );

  return {
    ...month,
    weeks: month.weeks.map((week) =>
      week.map((day) => {
        if (!day) return day;
        const slots = slotsByDate[day.isoDate] ?? [];
        const appointmentCount = appointmentCounts[day.isoDate] ?? 0;
        return {
          ...day,
          isAvailable: slots.some((slot) => slot.available),
          availabilityDots: createDots(appointmentCount),
          appointmentCountLabel: createCountLabel(appointmentCount),
        };
      }),
    ),
  };
}

export function buildScheduleForMonth(
  year: number,
  monthIndex: number,
  settings: DoctorAvailabilitySettings | null,
  appointments: ScheduleAppointment[],
): DoctorAvailabilitySummary {
  if (!doctorHasAvailability(settings)) {
    return {
      hasAvailability: false,
      month: buildEmptyMonth(year, monthIndex),
      timeSlotsByDate: {},
    };
  }

  return {
    hasAvailability: true,
    month: buildMonth(year, monthIndex, settings, appointments),
    timeSlotsByDate: buildTimeSlotsByDate(year, monthIndex, settings, appointments),
  };
}

export function isDoctorAvailableForRange(
  settings: DoctorAvailabilitySettings | null,
  startsAt: Date,
  endsAt: Date,
) {
  if (!doctorHasAvailability(settings)) return false;

  const timeZone = getTimeZoneOrDefault(settings.timeZone);
  const dateKey = getDateKeyInTimeZone(startsAt, timeZone);
  if (
    compareDateKeys(dateKey, settings.fromDate) < 0 ||
    compareDateKeys(dateKey, settings.toDate) > 0
  ) return false;

  const weekday = weekdayKeyForDate(dateKey, timeZone);
  const dayConfig = settings.days.find((day) => day.key === weekday);
  if (!dayConfig || dayConfig.slots.length === 0) return false;

  const requestedDurationMinutes = Math.round(
    (endsAt.getTime() - startsAt.getTime()) / 60_000,
  );
  if (requestedDurationMinutes !== settings.appointmentDurationMinutes) return false;

  const endDateKey = getDateKeyInTimeZone(endsAt, timeZone);
  if (endDateKey !== dateKey) return false;

  const startMinutes = getMinutesInTimeZone(startsAt, timeZone);
  const endMinutes = getMinutesInTimeZone(endsAt, timeZone);

  return dayConfig.slots.some((slot) => {
    const slotStart = timeToMinutes(slot.startTime);
    const slotEnd = timeToMinutes(slot.endTime);
    return startMinutes >= slotStart && endMinutes <= slotEnd;
  });
}

export function hasDoctorTimeConflict(
  appointments: ScheduleAppointment[],
  startsAt: Date,
  endsAt: Date,
  bufferMinutes: number,
  excludedStartAt?: Date,
) {
  return getUpcomingAppointments(appointments).some((appointment) => {
    if (excludedStartAt && appointment.startsAt.getTime() === excludedStartAt.getTime()) {
      return false;
    }

    const bufferedStart = appointment.startsAt.getTime() - bufferMinutes * 60_000;
    const bufferedEnd = appointment.endsAt.getTime() + bufferMinutes * 60_000;
    return startsAt.getTime() < bufferedEnd && endsAt.getTime() > bufferedStart;
  });
}

export function hasDoctorReachedDailyLimit(
  settings: DoctorAvailabilitySettings | null,
  appointments: ScheduleAppointment[],
  startsAt: Date,
  excludedAppointmentId?: string,
) {
  if (!doctorHasAvailability(settings)) return false;
  if (!settings.bookingLimits.dailyLimitEnabled) return false;

  const dailyLimit = Number(settings.bookingLimits.dailyLimit || '0');
  if (!dailyLimit || dailyLimit < 1) return false;

  const timeZone = getTimeZoneOrDefault(settings.timeZone);
  const dateKey = getDateKeyInTimeZone(startsAt, timeZone);
  const count = getUpcomingAppointments(appointments).filter((appointment) => {
    if (excludedAppointmentId && appointment.id === excludedAppointmentId) {
      return false;
    }
    return getDateKeyInTimeZone(appointment.startsAt, timeZone) === dateKey;
  }).length;

  return count >= dailyLimit;
}
