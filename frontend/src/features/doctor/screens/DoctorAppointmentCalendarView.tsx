import { ActivityIndicator, Modal, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { primitiveColors } from '@design/tokens';
import { Button } from '@shared/components/ui/Button';
import { Input } from '@shared/components/ui/Input';
import { HeaderBackButton } from '@shared/components/ui/HeaderBackButton';
import { fetchDoctorConsultations, type DoctorAppointment } from '../services/doctor.service';

// ── Calendar helpers ──────────────────────────────────────────────────────────

function pad(n: number) { return String(n).padStart(2, '0'); }

function toDateKey(date: Date) {
  return `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(date.getUTCDate())}`;
}
function fromDateKey(key: string) {
  const [y, m, d] = key.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d));
}
function addDays(key: string, days: number) {
  const d = fromDateKey(key);
  d.setUTCDate(d.getUTCDate() + days);
  return toDateKey(d);
}
function addMonths(key: string, months: number) {
  const d = fromDateKey(key);
  d.setUTCMonth(d.getUTCMonth() + months, 1);
  return toDateKey(d);
}
function startOfWeek(key: string) {
  const d = fromDateKey(key);
  d.setUTCDate(d.getUTCDate() - d.getUTCDay());
  return toDateKey(d);
}
function getDateKeyInTimeZone(iso: string, tz: string) {
  const parts = new Intl.DateTimeFormat('en-US', { timeZone: tz, year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(new Date(iso));
  const y = parts.find((p) => p.type === 'year')?.value ?? '2026';
  const m = parts.find((p) => p.type === 'month')?.value ?? '01';
  const d = parts.find((p) => p.type === 'day')?.value ?? '01';
  return `${y}-${m}-${d}`;
}
function formatDateLabel(key: string) {
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' }).format(fromDateKey(key));
}
function formatMonthLabel(key: string) {
  return new Intl.DateTimeFormat('en-US', { month: 'short', year: 'numeric', timeZone: 'UTC' }).format(fromDateKey(key));
}
function formatTimeLabel(iso: string, tz: string) {
  return new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit', hour12: true, timeZone: tz }).format(new Date(iso));
}
function formatTimeRange(iso: string, tz: string) {
  const start = new Date(iso);
  const end = new Date(start.getTime() + 30 * 60 * 1000);
  const fmt = new Intl.DateTimeFormat('en-US', { hour: '2-digit', minute: '2-digit', hour12: true, timeZone: tz });
  const clean = (s: string) => s.replace(/\s/g, '').toLowerCase();
  return `${clean(fmt.format(start))} - ${clean(fmt.format(end))}`;
}

interface DisplayAppointment {
  id: string;
  patientName: string;
  status: string;
  startsAtUtc: string;
  displayDateKey: string;
  displayDateLabel: string;
  displayTimeLabel: string;
  displayTimeRangeLabel: string;
}

interface CalendarDayCell {
  key: string;
  dayNumber: number;
  isCurrentMonth: boolean;
  appointments: DisplayAppointment[];
}

function buildMonthCells(focusedMonth: string, appointments: DisplayAppointment[]): CalendarDayCell[][] {
  const monthDate = fromDateKey(focusedMonth);
  const year = monthDate.getUTCFullYear();
  const month = monthDate.getUTCMonth();
  const first = new Date(Date.UTC(year, month, 1));
  const startOffset = first.getUTCDay();
  const start = new Date(first);
  start.setUTCDate(first.getUTCDate() - startOffset);

  return Array.from({ length: 6 }, (_, week) =>
    Array.from({ length: 7 }, (__, day) => {
      const cell = new Date(start);
      cell.setUTCDate(start.getUTCDate() + week * 7 + day);
      const key = toDateKey(cell);
      return {
        key,
        dayNumber: cell.getUTCDate(),
        isCurrentMonth: cell.getUTCMonth() === month,
        appointments: appointments.filter((a) => a.displayDateKey === key),
      };
    }),
  );
}

function patientName(a: DoctorAppointment) {
  const name = [a.patient?.firstName, a.patient?.lastName].filter(Boolean).join(' ');
  return name || 'Patient';
}

// ── Time zones ─────────────────────────────────────────────────────────────────

const TIME_ZONES = [
  { id: 'UTC', label: 'UTC — Coordinated Universal Time', offsetLabel: 'UTC', searchLabel: 'utc' },
  { id: 'Africa/Lagos', label: 'WAT — West Africa Time', offsetLabel: 'WAT', searchLabel: 'wat nigeria lagos' },
  { id: 'America/New_York', label: 'ET — Eastern Time', offsetLabel: 'ET', searchLabel: 'et eastern new york' },
  { id: 'America/Chicago', label: 'CT — Central Time', offsetLabel: 'CT', searchLabel: 'ct central chicago' },
  { id: 'America/Denver', label: 'MT — Mountain Time', offsetLabel: 'MT', searchLabel: 'mt mountain denver' },
  { id: 'America/Los_Angeles', label: 'PT — Pacific Time', offsetLabel: 'PT', searchLabel: 'pt pacific los angeles' },
  { id: 'Europe/London', label: 'GMT — Greenwich Mean Time', offsetLabel: 'GMT', searchLabel: 'gmt london uk' },
  { id: 'Europe/Paris', label: 'CET — Central European Time', offsetLabel: 'CET', searchLabel: 'cet paris europe' },
  { id: 'Asia/Dubai', label: 'GST — Gulf Standard Time', offsetLabel: 'GST', searchLabel: 'gst dubai gulf' },
  { id: 'Asia/Kolkata', label: 'IST — India Standard Time', offsetLabel: 'IST', searchLabel: 'ist india kolkata' },
  { id: 'Asia/Singapore', label: 'SGT — Singapore Time', offsetLabel: 'SGT', searchLabel: 'sgt singapore' },
] as const;

type TimeZone = (typeof TIME_ZONES)[number];
type ViewMode = 'day' | 'week' | 'month';

const WEEKDAY_KEYS = [
  'appointmentBooking.weekdays.sun', 'appointmentBooking.weekdays.mon',
  'appointmentBooking.weekdays.tue', 'appointmentBooking.weekdays.wed',
  'appointmentBooking.weekdays.thu', 'appointmentBooking.weekdays.fri',
  'appointmentBooking.weekdays.sat',
] as const;

const PILL_CLASSES = ['bg-blue-100', 'bg-primary-200', 'bg-green-100', 'bg-red-200', 'bg-primary-300'] as const;
const DOT_CLASSES = ['bg-blue-500', 'bg-primary-500', 'bg-green-500', 'bg-yellow-500', 'bg-red-500'] as const;
const AGENDA_BORDER = ['border-primary-500', 'border-red-300', 'border-green-300', 'border-blue-300'] as const;

function formatHourLabel(hour: number) {
  if (hour === 0) return '12 AM';
  if (hour < 12) return `${hour} AM`;
  if (hour === 12) return '12 PM';
  return `${hour - 12} PM`;
}

function getAppointmentHour(apt: DisplayAppointment) {
  const time = apt.displayTimeLabel;
  const [hourText] = time.split(':');
  const hour = Number(hourText);
  const isPm = time.includes('PM');
  if (isPm && hour !== 12) return hour + 12;
  if (!isPm && hour === 12) return 0;
  return hour;
}

// ── View ─────────────────────────────────────────────────────────────────────

export interface DoctorAppointmentCalendarViewProps {
  onBack: () => void;
  onAddAppointment: () => void;
  onSetAvailability: () => void;
}

export function DoctorAppointmentCalendarView({
  onBack,
  onAddAppointment,
  onSetAvailability,
}: DoctorAppointmentCalendarViewProps) {
  const { t } = useTranslation();
  const today = toDateKey(new Date());

  const [status, setStatus] = useState<'loading' | 'error' | 'success'>('loading');
  const [rawAppointments, setRawAppointments] = useState<DoctorAppointment[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>('month');
  const [selectedDate, setSelectedDate] = useState(today);
  const [focusedMonth, setFocusedMonth] = useState(today);
  const [daySelected, setDaySelected] = useState(false);
  const [selectedTimeZoneId, setSelectedTimeZoneId] = useState<string>('Africa/Lagos');
  const [timeZoneSearch, setTimeZoneSearch] = useState('');
  const [viewMenuOpen, setViewMenuOpen] = useState(false);
  const [actionMenuOpen, setActionMenuOpen] = useState(false);
  const [timeZoneModalOpen, setTimeZoneModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<DisplayAppointment | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  async function load() {
    setStatus('loading');
    try {
      const data = await fetchDoctorConsultations();
      setRawAppointments(data);
      setStatus('success');
    } catch {
      setStatus('error');
    }
  }

  useEffect(() => { void load(); }, []);

  const selectedTimeZone: TimeZone =
    TIME_ZONES.find((tz) => tz.id === selectedTimeZoneId) ?? TIME_ZONES[1];

  const appointments = useMemo<DisplayAppointment[]>(
    () =>
      rawAppointments.map((a) => {
        const displayDateKey = getDateKeyInTimeZone(a.startsAt, selectedTimeZone.id);
        return {
          id: a.id,
          patientName: patientName(a),
          status: a.status,
          startsAtUtc: a.startsAt,
          displayDateKey,
          displayDateLabel: formatDateLabel(displayDateKey),
          displayTimeLabel: formatTimeLabel(a.startsAt, selectedTimeZone.id),
          displayTimeRangeLabel: formatTimeRange(a.startsAt, selectedTimeZone.id),
        };
      }),
    [rawAppointments, selectedTimeZone.id],
  );

  const selectedDayAppointments = appointments.filter((a) => a.displayDateKey === selectedDate);

  const weekStart = startOfWeek(selectedDate);
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const key = addDays(weekStart, i);
    return { key, appointments: appointments.filter((a) => a.displayDateKey === key) };
  });

  const monthCells = buildMonthCells(focusedMonth, appointments);

  const filteredTimeZones = TIME_ZONES.filter((tz) =>
    tz.searchLabel.includes(timeZoneSearch.trim().toLowerCase()),
  );

  function selectDate(dateKey: string) {
    setSelectedDate(dateKey);
    setFocusedMonth(dateKey);
    setDaySelected(true);
    const dayApts = appointments.filter((a) => a.displayDateKey === dateKey);
    if (dayApts[0]) setSelectedAppointment(dayApts[0]);
    setDetailsOpen(false);
  }

  function navigatePrevious() {
    if (viewMode === 'month') { setFocusedMonth(addMonths(focusedMonth, -1)); setDaySelected(false); return; }
    setSelectedDate(addDays(selectedDate, viewMode === 'week' ? -7 : -1));
  }
  function navigateNext() {
    if (viewMode === 'month') { setFocusedMonth(addMonths(focusedMonth, 1)); setDaySelected(false); return; }
    setSelectedDate(addDays(selectedDate, viewMode === 'week' ? 7 : 1));
  }

  function openTimeZoneSelector() {
    setActionMenuOpen(false);
    setTimeZoneModalOpen(true);
  }

  function openAvailabilityScreen() {
    setActionMenuOpen(false);
    onSetAvailability();
  }

  // ── Render helpers ────────────────────────────────────────────────────────

  function renderMonthCell(cell: CalendarDayCell, compact: boolean) {
    const isSelected = daySelected && cell.key === selectedDate;
    return (
      <Pressable
        key={cell.key}
        onPress={() => selectDate(cell.key)}
        className={[compact ? 'h-10 w-12 items-center px-0.5 py-1' : 'h-[60px] w-12 items-center px-1 py-0.5', cell.isCurrentMonth ? 'opacity-100' : 'opacity-30'].join(' ')}
        accessibilityRole="button"
      >
        <View className={isSelected ? 'min-w-[28px] rounded bg-primary-500 px-2 items-center' : 'min-w-[28px] items-center'}>
          <Text className={isSelected ? 'text-b3 font-sans text-white text-center' : 'text-b3 font-sans text-grey-900 text-center'}>
            {cell.dayNumber}
          </Text>
        </View>
        {compact ? (
          cell.appointments.length > 0 ? (
            <View className="mt-1 flex-row items-center justify-center gap-1">
              {cell.appointments.slice(0, 2).map((a, i) => (
                <View key={`${cell.key}-${a.id}-dot`} className={['h-1 w-1 rounded-full', DOT_CLASSES[i % DOT_CLASSES.length]].join(' ')} />
              ))}
            </View>
          ) : null
        ) : (
          <View className="mt-2 w-[41px] items-center gap-0.5">
            {cell.appointments.slice(0, 2).map((a, i) => (
              <Pressable
                key={a.id}
                onPress={() => { setSelectedAppointment(a); setDetailsOpen(true); }}
                className={['h-[14px] w-[41px] rounded-sm px-1 py-0.5', PILL_CLASSES[i % PILL_CLASSES.length]].join(' ')}
                accessibilityRole="button"
                accessibilityLabel={a.patientName}
              >
                <Text className="text-[8px] font-sans text-grey-900 text-center" numberOfLines={1}>
                  {a.patientName}
                </Text>
              </Pressable>
            ))}
          </View>
        )}
      </Pressable>
    );
  }

  function renderMonthView() {
    const compact = daySelected;
    const weeks = compact && selectedDayAppointments.length === 0 ? monthCells.slice(0, 3) : monthCells;
    return (
      <>
        <View className={compact ? 'rounded-b-[32px] bg-white pb-5 pt-0' : 'bg-white pt-6'}>
          <View className="items-center">
            <View className={compact ? 'w-[336px] gap-3' : 'w-[336px] gap-4'}>
              {weeks.map((week, i) => (
                <View key={`month-week-${i}`} className="flex-row">
                  {week.map((cell) => renderMonthCell(cell, compact))}
                </View>
              ))}
            </View>
          </View>
          {compact && <View className="mt-3 items-center"><View className="h-1 w-[71px] rounded bg-grey-600" /></View>}
        </View>
        {compact ? (
          selectedDayAppointments.length > 0 ? (
            <ScrollView className="flex-1 bg-grey-100" contentContainerClassName="px-4 pt-[66px] pb-8 gap-2">
              {selectedDayAppointments.map((a, i) => (
                <Pressable
                  key={a.id}
                  onPress={() => { setSelectedAppointment(a); setDetailsOpen(true); }}
                  className={['h-[77px] justify-center border-l-2 bg-white px-4', AGENDA_BORDER[i % AGENDA_BORDER.length]].join(' ')}
                  accessibilityRole="button"
                >
                  <Text className="text-c1 font-sans text-grey-600">{a.displayTimeRangeLabel}</Text>
                  <Text className="mt-4 text-s2 font-semibold font-sans text-grey-900" numberOfLines={1}>
                    {t('calendar.appointmentWith', { name: a.patientName, defaultValue: `Appointment with ${a.patientName}` })}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          ) : (
            <View className="flex-1 items-center justify-center bg-grey-100">
              <Text className="text-h5 font-semibold font-sans text-grey-900">{t('calendar.noEvent', { defaultValue: 'No Event' })}</Text>
            </View>
          )
        ) : null}
      </>
    );
  }

  function renderTimeGrid(week: boolean) {
    const hours = Array.from({ length: 25 }, (_, i) => i);
    const columns = week ? 7 : 1;
    return (
      <ScrollView className="flex-1 bg-white" contentContainerClassName="items-center pb-10">
        <View className="w-[365px] flex-row">
          <View className="w-[29px] pt-[11px]">
            {hours.map((h) => (
              <Text key={`hour-${h}`} className="h-12 text-[10px] font-medium font-sans leading-[14px] text-grey-900 text-center">
                {String(h).padStart(2, '0')}
              </Text>
            ))}
          </View>
          <View className="w-[336px]">
            {hours.slice(0, 24).map((h) => {
              const rowApts = appointments.filter(
                (a) =>
                  (week ? weekDays.some((d) => d.key === a.displayDateKey) : a.displayDateKey === selectedDate) &&
                  getAppointmentHour(a) === h,
              );
              return (
                <View key={`grid-${h}`} className="h-12 flex-row border-b border-grey-200">
                  {Array.from({ length: columns }, (__, col) => {
                    const dayKey = week ? weekDays[col]?.key : selectedDate;
                    const cellApts = rowApts.filter((a) => a.displayDateKey === dayKey);
                    return (
                      <View
                        key={`grid-cell-${h}-${col}`}
                        className={week ? 'w-12 border-r border-grey-200 px-0.5 py-1' : 'w-[336px] border-x border-grey-200 px-0.5 py-1'}
                      >
                        {cellApts.slice(0, 2).map((a, i) => (
                          <Pressable
                            key={a.id}
                            onPress={() => { setSelectedAppointment(a); setDetailsOpen(true); }}
                            className={[week ? 'h-[14px] rounded-sm px-1' : 'h-[14px] rounded-sm px-1', PILL_CLASSES[i % PILL_CLASSES.length]].join(' ')}
                            accessibilityRole="button"
                          >
                            <Text className="text-[8px] font-sans text-grey-900" numberOfLines={1}>
                              {a.patientName}
                            </Text>
                          </Pressable>
                        ))}
                      </View>
                    );
                  })}
                </View>
              );
            })}
          </View>
        </View>
      </ScrollView>
    );
  }

  function renderWeekView() {
    return (
      <>
        <View className="items-center bg-white pb-3">
          <View className="w-[336px] flex-row">
            {weekDays.map((day) => (
              <Pressable
                key={day.key}
                onPress={() => selectDate(day.key)}
                className="h-10 w-12 items-center justify-start px-0.5 py-1"
                accessibilityRole="button"
              >
                <View className={day.key === selectedDate ? 'min-w-[28px] rounded bg-primary-500 px-2 items-center' : 'min-w-[28px] items-center'}>
                  <Text className={day.key === selectedDate ? 'text-b3 font-sans text-white text-center' : 'text-b3 font-sans text-grey-900 text-center'}>
                    {Number(day.key.split('-')[2])}
                  </Text>
                </View>
              </Pressable>
            ))}
          </View>
        </View>
        {renderTimeGrid(true)}
      </>
    );
  }

  function renderDetailsScreen() {
    if (!selectedAppointment) return null;
    return (
      <SafeAreaView className="flex-1 bg-white" edges={['top']}>
        <View className="bg-primary-50 h-[66px] justify-end">
          <View className="flex-row items-center justify-between px-4 pb-3 h-[48px]">
            <HeaderBackButton onPress={() => setDetailsOpen(false)} accessibilityLabel={t('common.back')} />
            <Text className="text-[16px] font-semibold font-sans text-grey-900">
              {t('calendar.detailsTitle', { defaultValue: 'Display' })}
            </Text>
            <Pressable onPress={() => setDetailsOpen(false)} accessibilityRole="button">
              <Ionicons name="close" size={22} color={primitiveColors['grey-900']} />
            </Pressable>
          </View>
        </View>
        <ScrollView className="flex-1 bg-white" contentContainerClassName="px-6 pt-[59px] pb-10">
          <View className="h-[484px] rounded-[32px] bg-white shadow-800">
            <View className="h-[155px] rounded-t-[32px] bg-primary-500 px-[26px] pt-[37px]">
              <Text className="text-h5 font-semibold font-sans text-white" numberOfLines={2}>
                {t('calendar.appointmentWith', { name: selectedAppointment.patientName, defaultValue: `Appointment with ${selectedAppointment.patientName}` })}
              </Text>
              <View className="mt-4 flex-row items-center gap-2">
                <Ionicons name="time-outline" size={20} color="rgba(255,255,255,0.6)" />
                <Text className="text-b3 font-sans text-white/60" numberOfLines={1}>
                  {`${selectedAppointment.displayDateLabel}, ${selectedAppointment.displayTimeRangeLabel}`}
                </Text>
              </View>
            </View>
            <View className="px-3 pt-6">
              <Text className="text-s2 font-semibold font-sans text-grey-900">
                {t('calendar.descriptionLabel', { defaultValue: 'Description' })}
              </Text>
              <Text className="mt-2 text-b3 font-sans text-grey-600">
                {t('calendar.reasonText', { name: selectedAppointment.patientName, defaultValue: `Consultation with ${selectedAppointment.patientName}.` })}
              </Text>
              <View className="mt-8 gap-4">
                <View className="flex-row justify-between">
                  <Text className="text-s2 font-semibold font-sans text-grey-900">{t('calendar.timeZone', { defaultValue: 'Time Zone' })}</Text>
                  <Text className="max-w-[180px] text-right text-b4 font-medium font-sans text-grey-600" numberOfLines={1}>
                    {selectedTimeZone.label.replace('UTC', 'GMT')}
                  </Text>
                </View>
                <View className="flex-row justify-between">
                  <Text className="text-s2 font-semibold font-sans text-grey-900">{t('calendar.guest', { defaultValue: 'Guest' })}</Text>
                  <Text className="text-b4 font-medium font-sans text-grey-600">{t('calendar.guestValue', { defaultValue: '1 Guest' })}</Text>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (status === 'loading') {
    return (
      <SafeAreaView className="flex-1 bg-white" edges={['top']}>
        <View className="bg-primary-50 h-[66px] justify-end">
          <View className="flex-row items-center justify-between px-4 pb-3 h-[48px]">
            <HeaderBackButton onPress={onBack} accessibilityLabel={t('common.back')} />
            <Text className="text-[16px] font-semibold font-sans text-grey-900">{t('calendar.title', { defaultValue: 'Calendar' })}</Text>
            <View className="w-[29px]" />
          </View>
        </View>
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={primitiveColors['primary-500']} />
        </View>
      </SafeAreaView>
    );
  }

  if (status === 'error') {
    return (
      <SafeAreaView className="flex-1 bg-white" edges={['top']}>
        <View className="bg-primary-50 h-[66px] justify-end">
          <View className="flex-row items-center justify-between px-4 pb-3 h-[48px]">
            <HeaderBackButton onPress={onBack} accessibilityLabel={t('common.back')} />
            <Text className="text-[16px] font-semibold font-sans text-grey-900">{t('calendar.title', { defaultValue: 'Calendar' })}</Text>
            <View className="w-[29px]" />
          </View>
        </View>
        <View className="flex-1 items-center justify-center px-6 gap-4">
          <Text className="text-b3 font-sans text-grey-600 text-center">{t('calendar.errorMessage', { defaultValue: "We couldn't load your calendar. Please try again." })}</Text>
          <Button label={t('common.retry')} onPress={load} />
        </View>
      </SafeAreaView>
    );
  }

  if (detailsOpen && selectedAppointment) return renderDetailsScreen();

  return (
    <SafeAreaView className={daySelected ? 'flex-1 bg-grey-100' : 'flex-1 bg-white'} edges={['top']}>
      {(viewMenuOpen || actionMenuOpen) && (
        <Pressable
          onPress={() => {
            setViewMenuOpen(false);
            setActionMenuOpen(false);
          }}
          className="absolute inset-0 z-10"
          accessibilityRole="button"
        />
      )}

      <View className="bg-primary-50 h-[66px] justify-end">
        <View className="flex-row items-center justify-between px-4 pb-3 h-[48px]">
          <HeaderBackButton onPress={onBack} accessibilityLabel={t('common.back')} />
          <Text className="text-[16px] font-semibold font-sans text-grey-900">{t('calendar.title', { defaultValue: 'Calendar' })}</Text>
          <View className="w-[29px]" />
        </View>
      </View>

      <View className="px-4 pt-5">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            <Text className="w-[118px] text-btn-medium font-semibold font-sans text-grey-900">
              {viewMode === 'month' ? formatMonthLabel(focusedMonth) : formatDateLabel(selectedDate)}
            </Text>
            <Pressable onPress={navigatePrevious} accessibilityRole="button" className="ml-3 h-6 w-6 items-center justify-center">
              <Ionicons name="chevron-back" size={24} color={primitiveColors['grey-900']} />
            </Pressable>
            <Pressable onPress={navigateNext} accessibilityRole="button" className="ml-3 h-6 w-6 items-center justify-center">
              <Ionicons name="chevron-forward" size={24} color={primitiveColors['grey-900']} />
            </Pressable>
          </View>

          <View className="flex-row items-center gap-3">
            <Pressable
              onPress={onAddAppointment}
              accessibilityRole="button"
              className="h-8 w-8 items-center justify-center"
            >
              <Ionicons name="add" size={24} color={primitiveColors['grey-900']} />
            </Pressable>
            <Pressable
              onPress={() => {
                setActionMenuOpen(false);
                setViewMenuOpen(!viewMenuOpen);
              }}
              accessibilityRole="button"
              className="h-8 w-8 items-center justify-center"
            >
              <Ionicons name="calendar-outline" size={24} color={primitiveColors['grey-900']} />
            </Pressable>
            <Pressable
              onPress={() => {
                setViewMenuOpen(false);
                setActionMenuOpen(!actionMenuOpen);
              }}
              accessibilityRole="button"
              className="h-8 w-8 items-center justify-center"
            >
              <MaterialCommunityIcons name="dots-vertical" size={22} color={primitiveColors['grey-900']} />
            </Pressable>
          </View>
        </View>

        {viewMode !== 'day' && (
          <View className="mt-7 items-center">
            <View className="w-[336px] flex-row">
              {WEEKDAY_KEYS.map((key) => (
                <View key={key} className="w-12 items-center justify-center py-1">
                  <Text className="w-12 text-center text-b4 font-medium font-sans text-grey-900" numberOfLines={1}>
                    {t(key)}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </View>

      {viewMode === 'month' ? renderMonthView() : null}
      {viewMode === 'week' ? renderWeekView() : null}
      {viewMode === 'day' ? renderTimeGrid(false) : null}

      {/* View mode menu */}
      {viewMenuOpen && (
        <View className="absolute right-14 top-[104px] z-20 w-[157px] rounded-lg bg-white p-4 shadow-200">
          <View className="gap-3">
            {([['day', 'today-outline'], ['week', 'calendar-clear-outline'], ['month', 'calendar-outline']] as const).map(([mode, icon]) => {
              const selected = viewMode === mode;
              return (
                <Pressable key={mode} onPress={() => { setViewMode(mode); setViewMenuOpen(false); }} className="h-8 flex-row items-center justify-between" accessibilityRole="button">
                  <View className="flex-1 flex-row items-center gap-2">
                    <Ionicons name={icon} size={20} color={selected ? primitiveColors['primary-500'] : primitiveColors['grey-900']} />
                    <Text className="flex-1 text-b3 font-sans text-grey-900" numberOfLines={1}>
                      {t(`calendar.views.${mode}`, { defaultValue: mode.charAt(0).toUpperCase() + mode.slice(1) })}
                    </Text>
                  </View>
                  {selected && <Ionicons name="checkmark" size={20} color={primitiveColors['primary-500']} />}
                </Pressable>
              );
            })}
          </View>
        </View>
      )}

      {actionMenuOpen && (
        <View
          className="absolute right-4 top-[104px] z-20 w-[164px] overflow-hidden rounded-[8px] bg-white py-2"
          style={{
            shadowColor: '#131927',
            shadowOffset: { width: 0, height: 10 },
            shadowOpacity: 0.1,
            shadowRadius: 32,
            elevation: 12,
          }}
        >
          <Pressable
            onPress={openAvailabilityScreen}
            className="bg-primary-50 px-[12px] py-[12px]"
            accessibilityRole="button"
          >
            <Text className="text-b1 font-sans text-grey-900">
              {t('calendar.setAvailability', { defaultValue: 'Set Availability' })}
            </Text>
          </Pressable>
          <Pressable
            onPress={openTimeZoneSelector}
            className="px-[12px] py-[12px]"
            accessibilityRole="button"
          >
            <Text className="text-b1 font-sans text-grey-900">
              {t('calendar.setTimezones', { defaultValue: 'Set Timezones' })}
            </Text>
          </Pressable>
        </View>
      )}

      {/* Timezone modal */}
      <Modal visible={timeZoneModalOpen} animationType="slide">
        <SafeAreaView className="flex-1 bg-white" edges={['top']}>
          <View className="bg-primary-50 h-[66px] justify-end">
            <View className="flex-row items-center justify-between px-4 pb-3 h-[48px]">
              <HeaderBackButton onPress={() => setTimeZoneModalOpen(false)} accessibilityLabel={t('common.back')} />
              <Text className="text-[16px] font-semibold font-sans text-grey-900">{t('calendar.timeZoneTitle', { defaultValue: 'Time Zone' })}</Text>
              <View className="w-[29px]" />
            </View>
          </View>
          <View className="px-4 pt-5">
            <Input
              value={timeZoneSearch}
              onChangeText={setTimeZoneSearch}
              placeholder={t('calendar.searchTimeZone', { defaultValue: 'Search' })}
              iconLeft={<Ionicons name="search" size={20} color={primitiveColors['grey-500']} />}
            />
          </View>
          <ScrollView className="flex-1" contentContainerClassName="px-4 py-4 gap-1">
            {filteredTimeZones.map((tz) => {
              const isSelected = tz.id === selectedTimeZoneId;
              return (
                <Pressable
                  key={tz.id}
                  onPress={() => { setSelectedTimeZoneId(tz.id); setTimeZoneModalOpen(false); setTimeZoneSearch(''); }}
                  className={['rounded-md px-3 py-3', isSelected ? 'bg-primary-100' : 'bg-white'].join(' ')}
                  accessibilityRole="button"
                >
                  <Text className="text-c2 font-sans text-grey-900">{tz.label}</Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}
