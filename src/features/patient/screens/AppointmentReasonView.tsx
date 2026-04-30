import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { primitiveColors } from '@design/tokens';
import { Button } from '@shared/components/ui/Button';
import { RadioGroup } from '@shared/components/ui/RadioGroup';
import { HeaderBackButton } from '@shared/components/ui/HeaderBackButton';
import { useAppointmentManagementStore } from '../store/appointmentManagement.store';
import type { AppointmentActionType, CancelReason, RescheduleReason } from '../types/appointmentManagement.types';

export interface AppointmentReasonViewProps {
  type: AppointmentActionType;
  onBack: () => void;
  onNext: () => void;
}

const CANCEL_OPTIONS = [
  { value: 'recovered',    labelKey: 'appointmentManagement.reason.cancel.recovered' },
  { value: 'bad_service',  labelKey: 'appointmentManagement.reason.cancel.badService' },
  { value: 'bad_doctor',   labelKey: 'appointmentManagement.reason.cancel.badDoctor' },
  { value: 'no_disclose',  labelKey: 'appointmentManagement.reason.cancel.noDisclose' },
  { value: 'others',       labelKey: 'appointmentManagement.reason.cancel.others' },
];

const RESCHEDULE_OPTIONS = [
  { value: 'important_event', labelKey: 'appointmentManagement.reason.reschedule.importantEvent' },
  { value: 'not_available',   labelKey: 'appointmentManagement.reason.reschedule.notAvailable' },
  { value: 'no_disclose',     labelKey: 'appointmentManagement.reason.reschedule.noDisclose' },
  { value: 'nothing',         labelKey: 'appointmentManagement.reason.reschedule.nothing' },
  { value: 'others',          labelKey: 'appointmentManagement.reason.reschedule.others' },
];

export function AppointmentReasonView({ type, onBack, onNext }: AppointmentReasonViewProps) {
  const { t } = useTranslation();
  const store = useAppointmentManagementStore();

  const currentReason = type === 'cancel' ? store.cancelReason : store.rescheduleReason;
  const options = type === 'cancel' ? CANCEL_OPTIONS : RESCHEDULE_OPTIONS;

  const questionKey =
    type === 'cancel'
      ? 'appointmentManagement.reason.cancel.question'
      : 'appointmentManagement.reason.reschedule.question';

  const headerTitleKey =
    type === 'cancel'
      ? 'appointmentManagement.cancelHeaderTitle'
      : 'appointmentManagement.rescheduleHeaderTitle';

  const radioOptions = options.map((o) => ({ value: o.value, label: t(o.labelKey) }));

  function handleChange(value: string) {
    if (type === 'cancel') {
      store.setCancelReason(value as CancelReason);
    } else {
      store.setRescheduleReason(value as RescheduleReason);
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      {/* Header */}
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
        contentContainerClassName="px-5 pt-6 pb-32 gap-6"
        showsVerticalScrollIndicator={false}
      >
        <Text className="text-[16px] font-semibold font-sans text-grey-900 leading-6">
          {t(questionKey)}
        </Text>

        <RadioGroup
          options={radioOptions}
          value={currentReason}
          onChange={handleChange}
        />
      </ScrollView>

      {/* Sticky CTA */}
      <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-grey-100 px-5 py-6">
        <Button
          label={t('appointmentManagement.next')}
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
