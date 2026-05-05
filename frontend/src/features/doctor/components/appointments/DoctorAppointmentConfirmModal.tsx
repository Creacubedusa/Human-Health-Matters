import { Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { primitiveColors } from '@design/tokens';
import { Button } from '@shared/components/ui/Button';
import type { DoctorAppointmentActionType } from '../../types/doctorAppointments.types';

export interface DoctorAppointmentConfirmModalProps {
  visible: boolean;
  type: DoctorAppointmentActionType;
  onClose: () => void;
  onConfirm: () => void;
}

export function DoctorAppointmentConfirmModal({
  visible,
  type,
  onClose,
  onConfirm,
}: DoctorAppointmentConfirmModalProps) {
  const { t } = useTranslation();

  if (!visible) return null;

  const messageKey =
    type === 'cancel'
      ? 'doctorAppointmentManagement.cancelConfirmMessage'
      : 'doctorAppointmentManagement.rescheduleConfirmMessage';

  return (
    <View className="absolute inset-0 z-50 items-center justify-center bg-black/50 px-6">
      <View className="bg-white rounded-2xl w-full overflow-hidden">
        <View className="h-9 items-end justify-center px-4">
          <Pressable onPress={onClose} accessibilityRole="button">
            <Ionicons name="close" size={20} color={primitiveColors['grey-600']} />
          </Pressable>
        </View>

        <View className="items-center px-8 pb-6 gap-5">
          <View className="w-[42px] h-[42px] rounded-full bg-yellow-50 items-center justify-center">
            <Ionicons name="warning" size={24} color={primitiveColors['yellow-500']} />
          </View>

          <Text className="text-[14px] font-sans text-grey-700 text-center leading-5">
            {t(messageKey)}
          </Text>
        </View>

        <View className="flex-row items-center justify-center gap-4 px-8 pb-8">
          <View className="flex-1">
            <Button
              label={t('doctorAppointmentManagement.noCancel')}
              variant="outline"
              size="medium"
              fullWidth
              onPress={onClose}
            />
          </View>
          <View className="flex-1">
            <Button
              label={t('doctorAppointmentManagement.yesSure')}
              variant="filled"
              size="medium"
              fullWidth
              onPress={onConfirm}
            />
          </View>
        </View>
      </View>
    </View>
  );
}
