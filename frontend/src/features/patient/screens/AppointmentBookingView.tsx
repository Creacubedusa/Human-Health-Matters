import { Modal, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'expo-router';
import { Alert } from '@shared/components/ui/Alert';
import { Button } from '@shared/components/ui/Button';
import { DOCTOR_FILTER_TAB_OPTIONS } from '../types/appointmentBooking.types';
import { useAppointmentBookingFlow } from '../hooks/useAppointmentBookingFlow';
import { AppointmentBookingHeader } from '../components/booking/AppointmentBookingHeader';
import { AppointmentCalendar } from '../components/booking/AppointmentCalendar';
import { AppointmentSuccessModal } from '../components/booking/AppointmentSuccessModal';
import { DoctorAvailabilityCard } from '../components/booking/DoctorAvailabilityCard';
import { DoctorFilterTabs } from '../components/booking/DoctorFilterTabs';
import { DoctorProfileHeroCard } from '../components/booking/DoctorProfileHeroCard';
import { DoctorRecommendationCard } from '../components/booking/DoctorRecommendationCard';
import { DoctorStatsRow } from '../components/booking/DoctorStatsRow';
import { FindingBestMatchCard } from '../components/booking/FindingBestMatchCard';
import { NuraMatchSummaryCard } from '../components/booking/NuraMatchSummaryCard';
import { TimeSlotGrid } from '../components/booking/TimeSlotGrid';
import { TabletContainer } from '@shared/components/ui/TabletContainer';

export interface AppointmentBookingViewProps {
  onExit: () => void;
  onFinish: () => void;
}

const WEEKDAY_KEYS = [
  'appointmentBooking.weekdays.sun',
  'appointmentBooking.weekdays.mon',
  'appointmentBooking.weekdays.tue',
  'appointmentBooking.weekdays.wed',
  'appointmentBooking.weekdays.thu',
  'appointmentBooking.weekdays.fri',
  'appointmentBooking.weekdays.sat',
] as const;

export function AppointmentBookingView({
  onExit,
  onFinish,
}: AppointmentBookingViewProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const {
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
    isAvailabilityAlertOpen,
    handleRetry,
    handleSelectFilter,
    handleSelectDoctor,
    handleBookNow,
    handleProceedToDateTime,
    handleSelectDate,
    handleSelectTimeSlot,
    handleMakeAppointment,
    handlePrevMonth,
    handleNextMonth,
    handleBack,
    handleCloseTimeSlotModal,
    handleCloseAvailabilityAlert,
    handleCloseSuccess,
    handleFinishBooking,
  } = useAppointmentBookingFlow();

  async function onBookNowSelected(doctor: typeof doctors[number]) {
    const appointmentId = await handleBookNow(doctor);
    if (!appointmentId) return;
    router.replace({
      pathname: '/(patient)/consultations',
      params: { appointmentId },
    });
  }

  const filterOptions = DOCTOR_FILTER_TAB_OPTIONS.map((option) => ({
    ...option,
    label: t(option.labelKey),
  }));

  const weekdayLabels = WEEKDAY_KEYS.map((key) => t(key));

  const headerTitle = (() => {
    if (step === 'doctorDetails') return t('appointmentBooking.headers.details');
    if (step === 'dateTime' || step === 'success') return t('appointmentBooking.headers.dateTime');
    return t('appointmentBooking.headers.default');
  })();

  function handleHeaderBack() {
    const backIntent = handleBack();
    if (backIntent === 'exit') {
      onExit();
    }
  }

  function renderRouteState() {
    if (routeViewState === 'error') {
      return (
        <View className="flex-1 px-4 pt-10">
          <View className="gap-4">
            <Alert
              status="error"
              variant="outline"
              title={t('appointmentBooking.states.errorTitle')}
              description={t('appointmentBooking.states.errorDescription')}
            />
            <Button
              label={t('common.retry')}
              onPress={handleRetry}
              size="large"
              fullWidth
            />
          </View>
        </View>
      );
    }

    if (routeViewState === 'empty') {
      return (
        <View className="flex-1 px-4 pt-10">
          <View className="gap-4">
            <Alert
              status="info"
              variant="outline"
              title={t('appointmentBooking.states.emptyTitle')}
              description={t('appointmentBooking.states.emptyDescription')}
            />
            <Button
              label={t('common.retry')}
              onPress={handleRetry}
              size="large"
              fullWidth
            />
          </View>
        </View>
      );
    }

    return null;
  }

  function renderFindingMatch() {
    return (
      <View className="flex-1 px-5">
        <FindingBestMatchCard title={t('appointmentBooking.finding.title')} />
      </View>
    );
  }

  function renderDoctorList() {
    return (
      <ScrollView
        className="flex-1"
        contentContainerClassName="px-[17px] pt-10 pb-8 gap-[34px]"
        showsVerticalScrollIndicator={false}
      >
        <NuraMatchSummaryCard
          title={t('appointmentBooking.nura.title')}
          message={nuraMessage}
        />

        <View className="gap-[34px]">
          <DoctorFilterTabs
            options={filterOptions}
            activeValue={activeFilter}
            onChange={handleSelectFilter}
          />

          <View className="gap-[27px]">
            {doctors.map((doctor) => (
              <DoctorRecommendationCard
                key={doctor.id}
                doctor={doctor}
                ctaLabel={t('appointmentBooking.actions.selectDoctor')}
                bookNowLabel={t('appointmentBooking.actions.bookNow', { defaultValue: 'Book Now' })}
                onSelect={handleSelectDoctor}
                onBookNow={(d) => void onBookNowSelected(d)}
              />
            ))}
          </View>
        </View>
      </ScrollView>
    );
  }

  function renderDoctorDetails() {
    if (!selectedDoctor) return null;

    return (
      <View className="flex-1 px-[9px] pb-8 pt-[49px]">
        <View className="flex-1 justify-between">
          <View className="gap-8">
            <DoctorProfileHeroCard doctor={selectedDoctor} />

            <View className="gap-6">
              <DoctorStatsRow
                items={[
                  { label: t('appointmentBooking.details.stats.patients'), value: selectedDoctor.patientsLabel },
                  { label: t('appointmentBooking.details.stats.experience'), value: selectedDoctor.experienceLabel },
                  { label: t('appointmentBooking.details.stats.rating'), value: selectedDoctor.rating.toFixed(1) },
                ]}
              />

              <View className="gap-3">
                <Text className="text-s2 font-semibold font-sans text-grey-900">
                  {t('appointmentBooking.details.aboutTitle')}
                </Text>
                <Text className="text-b3 font-sans leading-5 text-grey-500">
                  {selectedDoctor.about}
                </Text>
              </View>

              <DoctorAvailabilityCard
                title={t('appointmentBooking.details.availabilityTitle')}
                value={selectedDoctor.availabilityRange}
              />
            </View>
          </View>

          <View className="gap-3">
            <Button
              label={t('appointmentBooking.actions.next')}
              onPress={() => void handleProceedToDateTime()}
              size="large"
              fullWidth
            />
            <Pressable
              className="h-12 items-center justify-center rounded-xl bg-green-600"
              onPress={() => void onBookNowSelected(selectedDoctor)}
              accessibilityRole="button"
            >
              <Text className="text-[14px] font-semibold font-sans text-white">
                {t('appointmentBooking.actions.bookNow', { defaultValue: 'Book Now' })}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    );
  }

  function renderDateTime() {
    if (!calendarMonth) return null;

    return (
      <View className="flex-1 pt-[25px]">
        <View className="px-4">
          <AppointmentCalendar
            month={calendarMonth}
            headerLabel={calendarHeaderLabel}
            selectedDateKey={selectedDate?.key ?? null}
            weekdayLabels={weekdayLabels}
            onSelectDate={handleSelectDate}
            onPrevMonth={() => void handlePrevMonth()}
            onNextMonth={() => void handleNextMonth()}
          />
        </View>

        <TimeSlotGrid
          visible={isTimeSlotModalOpen}
          title={t('appointmentBooking.dateTime.availableTimeSlotTitle')}
          slots={timeSlots}
          selectedTimeSlotId={selectedTimeSlotId}
          ctaLabel={t('appointmentBooking.actions.makeAppointment')}
          ctaDisabled={!canMakeAppointment}
          onSelectTimeSlot={handleSelectTimeSlot}
          onClose={handleCloseTimeSlotModal}
          onSubmit={() => void handleMakeAppointment()}
        />

        <AppointmentSuccessModal
          visible={step === 'success'}
          appointment={bookedAppointment}
          messagePrefix={t('appointmentBooking.success.messagePrefix')}
          addToCalendarLabel={t('appointmentBooking.actions.addToCalender')}
          onClose={handleCloseSuccess}
          onConfirm={() => handleFinishBooking(() => onFinish())}
        />

        <Modal
          visible={isAvailabilityAlertOpen}
          transparent
          animationType="fade"
          onRequestClose={handleCloseAvailabilityAlert}
        >
          <View className="flex-1 items-center justify-center bg-grey-900/30 px-6">
            <View className="w-full max-w-[320px] rounded-[24px] bg-white px-6 py-6">
              <Text className="text-h5 font-semibold font-sans text-grey-900">
                {t('appointmentBooking.availabilityAlert.title')}
              </Text>
              <Text className="mt-3 text-b3 font-sans leading-5 text-grey-600">
                {t('appointmentBooking.availabilityAlert.description')}
              </Text>
              <Pressable
                onPress={handleCloseAvailabilityAlert}
                className="mt-6 h-12 items-center justify-center rounded-sm bg-primary-500"
                accessibilityRole="button"
              >
                <Text className="text-btn-large font-semibold font-sans text-white">
                  {t('appointmentBooking.availabilityAlert.cta')}
                </Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      </View>
    );
  }

  function renderContent() {
    if (step === 'findingMatch') return renderFindingMatch();
    if (step === 'doctorList') return renderDoctorList();
    if (step === 'doctorDetails') return renderDoctorDetails();
    return renderDateTime();
  }

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      <AppointmentBookingHeader
        title={headerTitle}
        onBack={handleHeaderBack}
        showCalendarIcon={step === 'doctorDetails'}
      />

      <TabletContainer>
        {routeViewState !== 'content' && step !== 'findingMatch'
          ? renderRouteState()
          : renderContent()}
      </TabletContainer>
    </SafeAreaView>
  );
}
