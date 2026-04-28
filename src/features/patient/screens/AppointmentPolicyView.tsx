import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { primitiveColors } from '@design/tokens';
import { Button } from '@shared/components/ui/Button';
import type { AppointmentActionType } from '../types/appointmentManagement.types';

export interface AppointmentPolicyViewProps {
  type: AppointmentActionType;
  onBack: () => void;
  onNext: () => void;
}

const RESCHEDULE_BULLETS = [
  'appointmentManagement.policy.reschedule.bullet1',
  'appointmentManagement.policy.reschedule.bullet2',
  'appointmentManagement.policy.reschedule.bullet3',
];

const CANCEL_BULLETS = [
  'appointmentManagement.policy.cancel.bullet1',
  'appointmentManagement.policy.cancel.bullet2',
  'appointmentManagement.policy.cancel.bullet3',
  'appointmentManagement.policy.cancel.bullet4',
];

export function AppointmentPolicyView({ type, onBack, onNext }: AppointmentPolicyViewProps) {
  const { t } = useTranslation();

  const titleKey =
    type === 'cancel'
      ? 'appointmentManagement.policy.cancel.title'
      : 'appointmentManagement.policy.reschedule.title';

  const bodyKey =
    type === 'cancel'
      ? 'appointmentManagement.policy.cancel.body'
      : 'appointmentManagement.policy.reschedule.body';

  const bullets = type === 'cancel' ? CANCEL_BULLETS : RESCHEDULE_BULLETS;

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      {/* Header */}
      <View className="bg-primary-50 h-[120px] justify-end">
        <View className="flex-row items-center justify-between px-4 h-[66px]">
          <Pressable
            onPress={onBack}
            className="w-[29px] h-[29px] rounded-lg bg-white items-center justify-center border border-grey-200"
            accessibilityRole="button"
            accessibilityLabel={t('common.back')}
          >
            <Ionicons name="chevron-back" size={20} color={primitiveColors['grey-900']} />
          </Pressable>

          <Text className="text-[16px] font-semibold font-sans text-grey-900">
            {t('appointmentManagement.policyHeaderTitle')}
          </Text>

          <View className="w-[29px]" />
        </View>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerClassName="px-6 pt-6 pb-32 gap-4"
        showsVerticalScrollIndicator={false}
      >
        <Text className="text-[20px] font-bold font-sans text-grey-900">
          {t(titleKey)}
        </Text>

        <Text className="text-[14px] font-sans text-grey-600 leading-6">
          {t(bodyKey)}
        </Text>

        {bullets.map((key) => (
          <View key={key} className="flex-row gap-3 items-start">
            <View className="w-1.5 h-1.5 rounded-full bg-primary-500 mt-[7px]" />
            <Text className="flex-1 text-[14px] font-sans text-grey-600 leading-5">
              {t(key)}
            </Text>
          </View>
        ))}
      </ScrollView>

      {/* Sticky CTA */}
      <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-grey-100 px-5 py-6">
        <Button
          label={t('appointmentManagement.next')}
          variant="filled"
          size="large"
          fullWidth
          onPress={onNext}
        />
      </View>
    </SafeAreaView>
  );
}
