import { ActivityIndicator, Modal, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { primitiveColors } from '@design/tokens';
import { Button } from '@shared/components/ui/Button';
import { Input } from '@shared/components/ui/Input';
import { AppointmentBookingHeader } from '../components/booking/AppointmentBookingHeader';
import { useCalendar } from '../hooks/useCalendar';
import type {
  CalendarDayCell,
  CalendarTimeZone,
  CalendarViewMode,
  DisplayCalendarAppointment,
} from '../types/calendar.types';

export interface CalendarViewProps {
  onBack: () => void;
  onCancelAppointment: (id: string) => void;
  onRescheduleAppointment: (id: string) => void;
}

const VIEW_MODE_KEYS: Array<{ value: CalendarViewMode; labelKey: string; icon: keyof typeof Ionicons.glyphMap }> = [
  { value: 'day', labelKey: 'calendar.views.day', icon: 'today-outline' },
  { value: 'week', labelKey: 'calendar.views.week', icon: 'calendar-clear-outline' },
  { value: 'month', labelKey: 'calendar.views.month', icon: 'calendar-outline' },
];

const CALENDAR_TEXT = {
  title: 'Calender',
  viewMode: 'Calendar view',
  timeZone: 'Time Zone',
  timeZoneTitle: 'Time Zone',
  searchTimeZone: 'Search',
  noEvent: 'No Event',
  detailsTitle: 'Display',
  appointmentWith: 'Appointment with {{name}}',
  reason: 'Reason',
  reasonText: 'It is a schedule consultation with {{name}}. The appointment will occur automatically in the app.',
  more: 'More',
  specialty: 'Specialty',
  request: 'Request',
  requestValue: 'One time',
  cancel: 'Cancel',
  description: 'Consultation with {{name}}',
  errorMessage: "We couldn't load your calendar. Please try again.",
  day: 'Day',
  week: 'Week',
  month: 'Month',
} as const;

const APPOINTMENT_PILL_CLASSES = [
  'bg-blue-100',
  'bg-primary-200',
  'bg-green-100',
  'bg-red-200',
  'bg-primary-300',
] as const;

const APPOINTMENT_DOT_CLASSES = [
  'bg-blue-500',
  'bg-primary-500',
  'bg-green-500',
  'bg-yellow-500',
  'bg-red-500',
] as const;

const AGENDA_BORDER_CLASSES = [
  'border-primary-500',
  'border-red-300',
  'border-green-300',
  'border-blue-300',
] as const;

function formatHourLabel(hour: number): string {
  if (hour === 0) return '12 AM';
  if (hour < 12) return `${hour} AM`;
  if (hour === 12) return '12 PM';
  return `${hour - 12} PM`;
}

function getAppointmentHour(appointment: DisplayCalendarAppointment): number {
  const time = appointment.displayTimeLabel;
  const [hourText] = time.split(':');
  const hour = Number(hourText);
  const isPm = time.includes('PM');

  if (isPm && hour !== 12) return hour + 12;
  if (!isPm && hour === 12) return 0;
  return hour;
}

export function CalendarView({
  onBack,
  onCancelAppointment,
  onRescheduleAppointment,
}: CalendarViewProps) {
  const { t } = useTranslation();
  const calendar = useCalendar();
  const calendarText = (key: string, fallback: string, options?: Record<string, string>) =>
    t(key, { defaultValue: fallback, ...options });

  function renderAppointmentPill(appointment: DisplayCalendarAppointment, index: number) {
    return (
      <Pressable
        key={appointment.id}
        onPress={() => calendar.selectAppointment(appointment)}
        className={[
          'h-[14px] w-[41px] rounded-sm px-1 py-0.5',
          APPOINTMENT_PILL_CLASSES[index % APPOINTMENT_PILL_CLASSES.length],
        ].join(' ')}
        accessibilityRole="button"
        accessibilityLabel={appointment.doctorName}
      >
        <Text className="text-[8px] font-sans text-grey-900 text-center tracking-[0.2px]" numberOfLines={1}>
          {appointment.doctorName.replace('Dr. ', 'Dr ')}
        </Text>
      </Pressable>
    );
  }

  function renderAppointmentDots(cell: CalendarDayCell) {
    if (cell.appointments.length === 0) return null;

    return (
      <View className="mt-1 flex-row items-center justify-center gap-1">
        {cell.appointments.slice(0, 2).map((appointment, index) => (
          <View
            key={`${cell.key}-${appointment.id}-dot`}
            className={[
              'h-1 w-1 rounded-full',
              APPOINTMENT_DOT_CLASSES[index % APPOINTMENT_DOT_CLASSES.length],
            ].join(' ')}
          />
        ))}
      </View>
    );
  }

  function renderMonthCell(cell: CalendarDayCell, compact: boolean) {
    const selected = calendar.daySelected && cell.key === calendar.selectedDate;
    const dayClass = [
      compact ? 'h-10 w-12 items-center px-0.5 py-1' : 'h-[60px] w-12 items-center px-1 py-0.5',
      cell.isCurrentMonth ? 'opacity-100' : 'opacity-30',
    ].join(' ');

    return (
      <Pressable
        key={cell.key}
        onPress={() => calendar.selectDate(cell.key)}
        className={dayClass}
        accessibilityRole="button"
      >
        <View className={selected ? 'min-w-[28px] rounded bg-primary-500 px-2 items-center' : 'min-w-[28px] items-center'}>
          <Text className={selected ? 'text-b3 font-sans text-white text-center' : 'text-b3 font-sans text-grey-900 text-center'}>
            {cell.dayNumber}
          </Text>
        </View>
        {compact ? (
          renderAppointmentDots(cell)
        ) : (
          <View className="mt-2 w-[41px] items-center gap-0.5">
            {cell.appointments.slice(0, 2).map(renderAppointmentPill)}
          </View>
        )}
      </Pressable>
    );
  }

  function renderMonthView() {
    const compact = calendar.daySelected;
    const selectedAppointments = calendar.selectedDayAppointments;
    const weeksToRender =
      compact && selectedAppointments.length === 0
        ? calendar.monthCells.slice(0, 3)
        : calendar.monthCells;

    return (
      <>
        <View className={compact ? 'rounded-b-[32px] bg-white pb-5 pt-0' : 'bg-white pt-6'}>
          <View className="items-center">
          <View className={compact ? 'w-[336px] gap-3' : 'w-[336px] gap-4'}>
            {weeksToRender.map((week, index) => (
              <View key={`calendar-month-week-${index}`} className="flex-row">
                {week.map((cell) => renderMonthCell(cell, compact))}
              </View>
            ))}
          </View>
        </View>
          {compact ? (
            <View className="mt-3 items-center">
              <View className="h-1 w-[71px] rounded bg-grey-600" />
            </View>
          ) : null}
        </View>

        {compact ? (
          selectedAppointments.length > 0 ? (
            <ScrollView className="flex-1 bg-grey-100" contentContainerClassName="px-4 pt-[66px] pb-8 gap-2">
              {selectedAppointments.map((appointment, index) => (
                <Pressable
                  key={appointment.id}
                  onPress={() => calendar.selectAppointment(appointment)}
                  className={[
                    'h-[77px] justify-center border-l-2 bg-white px-4',
                    AGENDA_BORDER_CLASSES[index % AGENDA_BORDER_CLASSES.length],
                  ].join(' ')}
                  accessibilityRole="button"
                >
                  <Text className="text-c1 font-sans text-grey-600">
                    {appointment.displayTimeRangeLabel}
                  </Text>
                  <Text className="mt-4 text-s2 font-semibold font-sans text-grey-900" numberOfLines={1}>
                    {calendarText('calendar.appointmentWith', CALENDAR_TEXT.appointmentWith, {
                      name: appointment.doctorName.replace('Dr. ', 'Dr '),
                    })}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          ) : (
            <View className="flex-1 items-center justify-center bg-grey-100">
              <Text className="text-h5 font-semibold font-sans text-grey-900">
                {calendarText('calendar.noEvent', CALENDAR_TEXT.noEvent)}
              </Text>
            </View>
          )
        ) : null}
      </>
    );
  }

  function renderGridAppointmentLabel(appointment: DisplayCalendarAppointment, index: number, wide = false) {
    return (
      <Pressable
        key={appointment.id}
        onPress={() => calendar.selectAppointment(appointment)}
        className={[
          wide ? 'h-[14px] rounded-sm px-1' : 'h-[14px] w-[41px] rounded-sm px-1',
          APPOINTMENT_PILL_CLASSES[index % APPOINTMENT_PILL_CLASSES.length],
        ].join(' ')}
        accessibilityRole="button"
      >
        <Text className="text-[8px] font-sans text-grey-900 tracking-[0.2px]" numberOfLines={1}>
          {wide
            ? calendarText('calendar.appointmentWith', CALENDAR_TEXT.appointmentWith, {
                name: appointment.doctorName.replace('Dr. ', 'Dr '),
              })
            : appointment.doctorName.replace('Dr. ', 'Dr ')}
        </Text>
      </Pressable>
    );
  }

  function renderTimeGrid(week: boolean) {
    const hours = Array.from({ length: 25 }, (_, index) => index);
    const columns = week ? 7 : 1;

    return (
      <ScrollView className="flex-1 bg-white" contentContainerClassName="items-center pb-10">
        <View className="w-[365px] flex-row">
          <View className="w-[29px] pt-[11px]">
            {hours.map((hour) => (
              <Text key={`hour-${hour}`} className="h-12 text-[10px] font-medium font-sans leading-[14px] text-grey-900 text-center">
                {String(hour).padStart(2, '0')}
              </Text>
            ))}
          </View>

          <View className="w-[336px]">
            {hours.slice(0, 24).map((hour) => {
              const rowAppointments = calendar.appointments.filter(
                (appointment) =>
                  (week
                    ? calendar.weekDays.some((day) => day.key === appointment.displayDateKey)
                    : appointment.displayDateKey === calendar.selectedDate) &&
                  getAppointmentHour(appointment) === hour,
              );

              return (
                <View key={`grid-row-${hour}`} className="h-12 flex-row border-b border-grey-200">
                  {Array.from({ length: columns }, (_, colIndex) => {
                    const dayKey = week ? calendar.weekDays[colIndex]?.key : calendar.selectedDate;
                    const cellAppointments = rowAppointments.filter(
                      (appointment) => appointment.displayDateKey === dayKey,
                    );

                    return (
                      <View
                        key={`grid-cell-${hour}-${colIndex}`}
                        className={week ? 'w-12 border-r border-grey-200 px-0.5 py-1' : 'w-[336px] border-x border-grey-200 px-0.5 py-1'}
                      >
                        {cellAppointments.slice(0, 2).map((appointment, index) =>
                          renderGridAppointmentLabel(appointment, index, !week),
                        )}
                      </View>
                    );
                  })}
                </View>
              );
            })}
            <View className="absolute left-0 right-0 top-[169px] h-px bg-error" />
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
            {calendar.weekDays.map((day) => (
              <Pressable
                key={day.key}
                onPress={() => calendar.selectDate(day.key)}
                className="h-10 w-12 items-center justify-start px-0.5 py-1"
                accessibilityRole="button"
              >
                <View className={day.key === calendar.selectedDate ? 'min-w-[28px] rounded bg-primary-500 px-2 items-center' : 'min-w-[28px] items-center'}>
                  <Text className={day.key === calendar.selectedDate ? 'text-b3 font-sans text-white text-center' : 'text-b3 font-sans text-grey-900 text-center'}>
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

  function renderDayView() {
    return renderTimeGrid(false);
  }

  function renderViewMenu() {
    if (!calendar.viewMenuOpen) return null;

    return (
      <View className="absolute right-4 top-[104px] z-20 w-[157px] rounded-lg bg-white p-4 shadow-200">
        <View className="gap-3">
          {VIEW_MODE_KEYS.map((mode) => {
            const selected = calendar.viewMode === mode.value;
            return (
              <Pressable
                key={mode.value}
                onPress={() => calendar.setViewMode(mode.value)}
                className="h-8 flex-row items-center justify-between"
                accessibilityRole="button"
              >
                <View className="flex-1 flex-row items-center gap-2">
                  <Ionicons
                    name={mode.icon}
                    size={20}
                    color={selected ? primitiveColors['primary-500'] : primitiveColors['grey-900']}
                  />
                  <Text className="flex-1 text-b3 font-sans text-grey-900" numberOfLines={1}>
                    {calendarText(
                      mode.labelKey,
                      mode.value === 'day'
                        ? CALENDAR_TEXT.day
                        : mode.value === 'week'
                        ? CALENDAR_TEXT.week
                        : CALENDAR_TEXT.month,
                    )}
                  </Text>
                </View>
                {selected ? (
                  <Ionicons name="checkmark" size={20} color={primitiveColors['primary-500']} />
                ) : null}
              </Pressable>
            );
          })}
        </View>
      </View>
    );
  }

  function renderDetailsScreen() {
    if (!calendar.detailsOpen || !calendar.selectedAppointment) return null;

    const appointment = calendar.selectedAppointment;

    return (
      <SafeAreaView className="flex-1 bg-white" edges={['top']}>
        <AppointmentBookingHeader
          title={calendarText('calendar.detailsTitle', CALENDAR_TEXT.detailsTitle)}
          onBack={calendar.closeDetails}
          rightIconName="close"
          onRightPress={calendar.closeDetails}
          rightAccessibilityLabel={calendarText('calendar.detailsTitle', CALENDAR_TEXT.detailsTitle)}
        />
        <ScrollView className="flex-1 bg-white" contentContainerClassName="px-6 pt-[59px] pb-10">
          <View className="h-[484px] rounded-[32px] bg-white shadow-800">
            <View className="h-[155px] rounded-t-[32px] bg-primary-500 px-[26px] pt-[37px]">
              <Text className="text-h5 font-semibold font-sans text-white" numberOfLines={2}>
                {calendarText('calendar.appointmentWith', CALENDAR_TEXT.appointmentWith, {
                  name: appointment.doctorName.replace('Dr. ', 'Dr '),
                })}
              </Text>
              <View className="mt-4 flex-row items-center gap-2">
                <Ionicons name="time-outline" size={20} color="rgba(255,255,255,0.6)" />
                <Text className="text-b3 font-sans text-white/60" numberOfLines={1}>
                  {`${appointment.displayDateLabel}, ${appointment.displayTimeRangeLabel}`}
                </Text>
              </View>
            </View>

            <View className="px-3 pt-6">
              <Text className="text-s2 font-semibold font-sans text-grey-900">
                {calendarText('calendar.descriptionLabel', 'Description')}
              </Text>
              <Text className="mt-2 text-b3 font-sans text-grey-600">
                {calendarText('calendar.reasonText', CALENDAR_TEXT.reasonText, {
                  name: appointment.doctorName.replace('Dr. ', 'Dr '),
                })}
              </Text>

              <Text className="mt-3 text-btn-medium font-semibold font-sans text-primary-500">
                {calendarText('calendar.more', CALENDAR_TEXT.more)}
              </Text>

              <View className="mt-8 gap-4">
                <View className="flex-row justify-between">
                  <Text className="text-s2 font-semibold font-sans text-grey-900">
                    {calendarText('calendar.repeat', 'Repeat')}
                  </Text>
                  <Text className="text-b4 font-medium font-sans text-grey-600">
                    {calendarText('calendar.requestValue', CALENDAR_TEXT.requestValue)}
                  </Text>
                </View>
                <View className="flex-row justify-between">
                  <Text className="text-s2 font-semibold font-sans text-grey-900">
                    {calendarText('calendar.timeZone', CALENDAR_TEXT.timeZone)}
                  </Text>
                  <Text className="max-w-[180px] text-right text-b4 font-medium font-sans text-grey-600" numberOfLines={1}>
                    {calendar.selectedTimeZone.label.replace('UTC', 'GMT')}
                  </Text>
                </View>
                <View className="flex-row justify-between">
                  <Text className="text-s2 font-semibold font-sans text-grey-900">
                    {calendarText('calendar.guest', 'Guest')}
                  </Text>
                  <Text className="text-b4 font-medium font-sans text-grey-600">
                    {calendarText('calendar.guestValue', '1 Guest')}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  function renderTimeZoneModal() {
    return (
      <Modal visible={calendar.timeZoneModalOpen} animationType="slide">
        <SafeAreaView className="flex-1 bg-white" edges={['top']}>
          <AppointmentBookingHeader
            title={calendarText('calendar.timeZoneTitle', CALENDAR_TEXT.timeZoneTitle)}
            onBack={() => calendar.setTimeZoneModalOpen(false)}
          />
          <View className="px-4 pt-5">
            <Input
              value={calendar.timeZoneSearch}
              onChangeText={calendar.setTimeZoneSearch}
              placeholder={calendarText('calendar.searchTimeZone', CALENDAR_TEXT.searchTimeZone)}
              iconLeft={<Ionicons name="search" size={20} color={primitiveColors['grey-500']} />}
            />
          </View>
          <ScrollView className="flex-1" contentContainerClassName="px-4 py-4 gap-1">
            {calendar.filteredTimeZones.map((timeZone: CalendarTimeZone) => {
              const selected = timeZone.id === calendar.selectedTimeZone.id;
              return (
                <Pressable
                  key={timeZone.id}
                  onPress={() => calendar.setTimeZone(timeZone)}
                  className={[
                    'rounded-md px-3 py-3',
                    selected ? 'bg-primary-100' : 'bg-white',
                  ].join(' ')}
                  accessibilityRole="button"
                >
                  <Text className="text-c2 font-sans text-grey-900">
                    {timeZone.label}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </SafeAreaView>
      </Modal>
    );
  }

  if (calendar.status === 'loading') {
    return (
      <SafeAreaView className="flex-1 bg-white" edges={['top']}>
        <AppointmentBookingHeader title={calendarText('calendar.title', CALENDAR_TEXT.title)} onBack={onBack} />
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={primitiveColors['primary-500']} />
        </View>
      </SafeAreaView>
    );
  }

  if (calendar.status === 'error') {
    return (
      <SafeAreaView className="flex-1 bg-white" edges={['top']}>
        <AppointmentBookingHeader title={calendarText('calendar.title', CALENDAR_TEXT.title)} onBack={onBack} />
        <View className="flex-1 items-center justify-center px-6 gap-4">
          <Text className="text-b3 font-sans text-grey-600 text-center">
            {calendarText('calendar.errorMessage', CALENDAR_TEXT.errorMessage)}
          </Text>
          <Button label={t('common.retry')} onPress={calendar.retry} />
        </View>
      </SafeAreaView>
    );
  }

  if (calendar.detailsOpen && calendar.selectedAppointment) {
    return renderDetailsScreen();
  }

  return (
    <SafeAreaView className={calendar.daySelected ? 'flex-1 bg-grey-100' : 'flex-1 bg-white'} edges={['top']}>
      <AppointmentBookingHeader title={calendarText('calendar.title', CALENDAR_TEXT.title)} onBack={onBack} />

      <View className="px-4 pt-5">
        <View className="flex-row items-center justify-between">
          <View className="w-[190px] flex-row items-center">
            <Text className="w-[110px] text-btn-medium font-semibold font-sans text-grey-900">
              {calendar.viewMode === 'month' ? calendar.focusedMonthDateLabel : calendar.selectedDateLabel}
            </Text>
            <Pressable
              onPress={calendar.navigatePrevious}
              accessibilityRole="button"
              className="ml-4 h-6 w-6 items-center justify-center"
            >
              <Ionicons name="chevron-back" size={24} color={primitiveColors['grey-900']} />
            </Pressable>
            <Pressable
              onPress={calendar.navigateNext}
              accessibilityRole="button"
              className="ml-4 h-6 w-6 items-center justify-center"
            >
              <Ionicons name="chevron-forward" size={24} color={primitiveColors['grey-900']} />
            </Pressable>
          </View>

          <View className="flex-row items-center gap-4">
            <Pressable
              onPress={() => calendar.setViewMenuOpen(!calendar.viewMenuOpen)}
              accessibilityRole="button"
              accessibilityLabel={calendarText('calendar.viewMode', CALENDAR_TEXT.viewMode)}
            >
              <Ionicons name="calendar-outline" size={24} color={primitiveColors['grey-900']} />
            </Pressable>
            <Pressable
              onPress={() => calendar.setTimeZoneModalOpen(true)}
              accessibilityRole="button"
              accessibilityLabel={calendarText('calendar.timeZone', CALENDAR_TEXT.timeZone)}
            >
              <MaterialCommunityIcons name="map-clock-outline" size={24} color={primitiveColors['grey-900']} />
            </Pressable>
          </View>
        </View>

        {calendar.viewMode !== 'day' ? (
          <View className="mt-7 items-center">
            <View className="w-[336px] flex-row">
              {calendar.weekdayKeys.map((key) => (
                <View key={key} className="w-12 items-center justify-center py-1">
                  <Text className="w-12 text-center text-b4 font-medium font-sans text-grey-900" numberOfLines={1}>
                    {t(key)}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        ) : null}
      </View>

      {calendar.viewMode === 'month' ? renderMonthView() : null}
      {calendar.viewMode === 'week' ? renderWeekView() : null}
      {calendar.viewMode === 'day' ? renderDayView() : null}
      {renderViewMenu()}
      {renderTimeZoneModal()}
    </SafeAreaView>
  );
}
