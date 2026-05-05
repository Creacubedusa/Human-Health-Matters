import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { Button } from '@shared/components/ui/Button';
import { RadioGroup } from '@shared/components/ui/RadioGroup';
import { HeaderBackButton } from '@shared/components/ui/HeaderBackButton';
import { useDoctorAppointmentsStore } from '../store/doctorAppointments.store';
import type { DoctorAppointmentActionType, DoctorCancelReason, DoctorRescheduleReason } from '../types/doctorAppointments.types';

export interface DoctorAppointmentReasonViewProps {
  type: DoctorAppointmentActionType;
  onBack: () => void;
  onNext: () => void;
}

const CANCEL_OPTIONS = [
  { value: 'medical_emergency',  labelKey: 'doctorAppointmentManagement.reason.cancel.medicalEmergency' },
  { value: 'doctor_illness',     labelKey: 'doctorAppointmentManagement.reason.cancel.doctorIllness' },
  { value: 'personal_emergency', labelKey: 'doctorAppointmentManagement.reason.cancel.personalEmergency' },
  { value: 'scheduling_error',   labelKey: 'doctorAppointmentManagement.reason.cancel.schedulingError' },
  { value: 'unexpected_travel',  labelKey: 'doctorAppointmentManagement.reason.cancel.unexpectedTravel' },
  { value: 'others',             labelKey: 'doctorAppointmentManagement.reason.cancel.others' },
];

const RESCHEDULE_OPTIONS = [
  { value: 'unexpected_duty',      labelKey: 'doctorAppointmentManagement.reason.reschedule.unexpectedDuty' },
  { value: 'personal_emergency',   labelKey: 'doctorAppointmentManagement.reason.reschedule.personalEmergency' },
  { value: 'health_issue',         labelKey: 'doctorAppointmentManagement.reason.reschedule.healthIssue' },
  { value: 'scheduling_conflict',  labelKey: 'doctorAppointmentManagement.reason.reschedule.schedulingConflict' },
  { value: 'others',               labelKey: 'doctorAppointmentManagement.reason.reschedule.others' },
];

export function DoctorAppointmentReasonView({ type, onBack, onNext }: DoctorAppointmentReasonViewProps) {
  const { t } = useTranslation();
  const store = useDoctorAppointmentsStore();

  const currentReason = type === 'cancel' ? store.cancelReason : store.rescheduleReason;
  const options = type === 'cancel' ? CANCEL_OPTIONS : RESCHEDULE_OPTIONS;

  const questionKey =
    type === 'cancel'
      ? 'doctorAppointmentManagement.reason.cancel.question'
      : 'doctorAppointmentManagement.reason.reschedule.question';

  const headerTitleKey =
    type === 'cancel'
      ? 'doctorAppointmentManagement.cancelHeaderTitle'
      : 'doctorAppointmentManagement.rescheduleHeaderTitle';

  const radioOptions = options.map((o) => ({ value: o.value, label: t(o.labelKey) }));

  function handleChange(value: string) {
    if (type === 'cancel') {
      store.setCancelReason(value as DoctorCancelReason);
    } else {
      store.setRescheduleReason(value as DoctorRescheduleReason);
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      <View className="bg-primary-50 h-[66px] justify-end">
        <View className="flex-row items-center justify-between px-4 pb-3 h-[48px]">
          <HeaderBackButton onPress={onBack} accessibilityLabel={t('common.back')} />
          <Text className="text-[16px] font-semibold font-sans text-grey-900">
            {t(headerTitleKey)}
          </Text>
          <View className="w-[29px]" />
        </View>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerClassName="px-5 pt-8 pb-36 gap-8"
        showsVerticalScrollIndicator={false}
      >
        <Text className="text-[24px] font-semibold font-sans text-grey-900 leading-7">
          {t(questionKey)}
        </Text>

        <RadioGroup options={radioOptions} value={currentReason} onChange={handleChange} />
      </ScrollView>

      <View className="absolute bottom-0 left-0 right-0 bg-white px-5 py-6">
        <Button
          label={t('doctorAppointmentManagement.next')}
          variant="filled"
          size="large"
          fullWidth
          disabled={!currentReason}
          onPress={onNext}
        />
      </View>
    </SafeAreaView>
  );
}
