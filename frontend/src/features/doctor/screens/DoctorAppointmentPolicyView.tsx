import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { Button } from '@shared/components/ui/Button';
import { HeaderBackButton } from '@shared/components/ui/HeaderBackButton';
import type { DoctorAppointmentActionType } from '../types/doctorAppointments.types';

export interface DoctorAppointmentPolicyViewProps {
  type: DoctorAppointmentActionType;
  onBack: () => void;
  onNext: () => void;
}

const RESCHEDULE_BULLETS = [
  'doctorAppointmentManagement.policy.reschedule.bullet1',
  'doctorAppointmentManagement.policy.reschedule.bullet2',
  'doctorAppointmentManagement.policy.reschedule.bullet3',
];

const CANCEL_BULLETS = [
  'doctorAppointmentManagement.policy.cancel.bullet1',
  'doctorAppointmentManagement.policy.cancel.bullet2',
  'doctorAppointmentManagement.policy.cancel.bullet3',
  'doctorAppointmentManagement.policy.cancel.bullet4',
];

export function DoctorAppointmentPolicyView({ type, onBack, onNext }: DoctorAppointmentPolicyViewProps) {
  const { t } = useTranslation();

  const titleKey =
    type === 'cancel'
      ? 'doctorAppointmentManagement.policy.cancel.title'
      : 'doctorAppointmentManagement.policy.reschedule.title';

  const bodyKey =
    type === 'cancel'
      ? 'doctorAppointmentManagement.policy.cancel.body'
      : 'doctorAppointmentManagement.policy.reschedule.body';

  const bullets = type === 'cancel' ? CANCEL_BULLETS : RESCHEDULE_BULLETS;

  const headerTitleKey =
    type === 'cancel'
      ? 'doctorAppointmentManagement.cancelHeaderTitle'
      : 'doctorAppointmentManagement.policyHeaderTitle';

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
        contentContainerClassName="px-6 pt-6 pb-32 gap-4"
        showsVerticalScrollIndicator={false}
      >
        <Text className="text-[20px] font-bold font-sans text-grey-900">{t(titleKey)}</Text>

        <Text className="text-[14px] font-sans text-grey-600 leading-6">{t(bodyKey)}</Text>

        {bullets.map((key) => (
          <View key={key} className="flex-row gap-3 items-start">
            <View className="w-1.5 h-1.5 rounded-full bg-primary-500 mt-[7px]" />
            <Text className="flex-1 text-[14px] font-sans text-grey-600 leading-5">{t(key)}</Text>
          </View>
        ))}
      </ScrollView>

      <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-grey-100 px-5 py-6">
        <Button
          label={t('doctorAppointmentManagement.next')}
          variant="filled"
          size="large"
          fullWidth
          onPress={onNext}
        />
      </View>
    </SafeAreaView>
  );
}
