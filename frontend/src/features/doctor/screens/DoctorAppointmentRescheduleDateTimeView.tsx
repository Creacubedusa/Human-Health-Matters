import { ActivityIndicator, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { primitiveColors } from '@design/tokens';
import { Button } from '@shared/components/ui/Button';
import { HeaderBackButton } from '@shared/components/ui/HeaderBackButton';
import { DoctorCalendarGrid } from '../components/appointments/DoctorCalendarGrid';
import { DoctorTimeSlotModal } from '../components/appointments/DoctorTimeSlotModal';
import { useDoctorRescheduleDatetime } from '../hooks/useDoctorRescheduleDatetime';

const WEEKDAY_KEYS = [
  'appointmentBooking.weekdays.sun',
  'appointmentBooking.weekdays.mon',
  'appointmentBooking.weekdays.tue',
  'appointmentBooking.weekdays.wed',
  'appointmentBooking.weekdays.thu',
  'appointmentBooking.weekdays.fri',
  'appointmentBooking.weekdays.sat',
];

export interface DoctorAppointmentRescheduleDateTimeViewProps {
  onBack: () => void;
  onSuccess: () => void;
}

export function DoctorAppointmentRescheduleDateTimeView({
  onBack,
  onSuccess,
}: DoctorAppointmentRescheduleDateTimeViewProps) {
  const { t } = useTranslation();
  const {
    status,
    hasSelectedAppointment,
    calendarMonth,
    timeSlots,
    selectedDate,
    selectedTimeSlotId,
    canMakeAppointment,
    setSelectedDate,
    setSelectedTimeSlot,
    handleMakeAppointment,
    handlePrevMonth,
    handleNextMonth,
    retry,
  } = useDoctorRescheduleDatetime();

  const weekdayLabels = WEEKDAY_KEYS.map((key) => t(key));
  const headerLabel = calendarMonth?.label ?? '';

  const header = (
    <View className="bg-primary-50 h-[66px] justify-end">
      <View className="flex-row items-center justify-between px-4 pb-3 h-[48px]">
        <HeaderBackButton onPress={onBack} accessibilityLabel={t('common.back')} />
        <Text className="text-[16px] font-semibold font-sans text-grey-900">
          {t('doctorAppointmentManagement.rescheduleHeaderTitle')}
        </Text>
        <View className="w-[29px]" />
      </View>
    </View>
  );

  if (status === 'loading') {
    return (
      <SafeAreaView className="flex-1 bg-white" edges={['top']}>
        {header}
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={primitiveColors['primary-500']} />
        </View>
      </SafeAreaView>
    );
  }

  if (status === 'error') {
    return (
      <SafeAreaView className="flex-1 bg-white" edges={['top']}>
        {header}
        <View className="flex-1 items-center justify-center px-6 gap-4">
          <Ionicons name="calendar-outline" size={48} color={primitiveColors['grey-300']} />
          <Text className="text-[15px] font-semibold font-sans text-grey-900 text-center">
            {t('doctorAppointmentManagement.rescheduleDateTimeErrorTitle')}
          </Text>
          <Text className="text-[13px] font-sans text-grey-500 text-center leading-5">
            {hasSelectedAppointment
              ? t('doctorAppointmentManagement.rescheduleDateTimeErrorSubtitle')
              : t('doctorAppointmentManagement.rescheduleDateTimeMissingSelection')}
          </Text>
          <Button
            label={hasSelectedAppointment ? t('common.retry') : t('doctorAppointmentManagement.goBack')}
            variant="filled"
            size="large"
            onPress={hasSelectedAppointment ? retry : onBack}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      {header}

      <ScrollView
        className="flex-1"
        contentContainerClassName="px-4 pt-4 pb-32"
        showsVerticalScrollIndicator={false}
      >
        {calendarMonth && (
          <DoctorCalendarGrid
            month={calendarMonth}
            headerLabel={headerLabel}
            selectedDateKey={selectedDate}
            weekdayLabels={weekdayLabels}
            onSelectDate={setSelectedDate}
            onPrevMonth={handlePrevMonth}
            onNextMonth={handleNextMonth}
          />
        )}
      </ScrollView>

      <DoctorTimeSlotModal
        visible={!!selectedDate}
        title={t('appointmentBooking.dateTime.availableTimeSlotTitle')}
        slots={timeSlots}
        selectedTimeSlotId={selectedTimeSlotId}
        ctaLabel={t('appointmentBooking.actions.makeAppointment')}
        ctaDisabled={!canMakeAppointment}
        onClose={() => setSelectedDate(null)}
        onSelectTimeSlot={setSelectedTimeSlot}
        onSubmit={() => void handleMakeAppointment(onSuccess)}
      />

      {selectedDate && timeSlots.length === 0 && (
        <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-grey-100 px-5 py-6">
          <Button
            label={t('appointmentBooking.actions.makeAppointment')}
            variant="filled"
            size="large"
            fullWidth
            disabled={!canMakeAppointment}
            onPress={() => void handleMakeAppointment(onSuccess)}
          />
        </View>
      )}
    </SafeAreaView>
  );
}
