import { Pressable, Text, View } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { primitiveColors } from '@design/tokens';
import { Button } from '@shared/components/ui/Button';
import type { DoctorAppointmentActionType } from '../../types/doctorAppointments.types';

export interface DoctorAppointmentActionSuccessModalProps {
  visible: boolean;
  type: DoctorAppointmentActionType;
  onClose: () => void;
  onGoBack: () => void;
}

export function DoctorAppointmentActionSuccessModal({
  visible,
  type,
  onClose,
  onGoBack,
}: DoctorAppointmentActionSuccessModalProps) {
  const { t } = useTranslation();

  if (!visible) return null;

  const messageKey =
    type === 'cancel'
      ? 'doctorAppointmentManagement.cancelSuccessMessage'
      : 'doctorAppointmentManagement.rescheduleSuccessMessage';

  return (
    <View className="absolute inset-0 z-50 items-center justify-center bg-black/50 px-6">
      <View className="bg-white rounded-lg border border-grey-200 w-full overflow-hidden">
        {/* Header — close button top-right */}
        <View className="flex-row items-center justify-end px-4 pt-4">
          <Pressable onPress={onClose} accessibilityRole="button" accessibilityLabel={t('common.dismiss')}>
            <Ionicons name="close" size={20} color={primitiveColors['grey-400']} />
          </Pressable>
        </View>

        {/* Body — verified icon + message */}
        <View className="items-center px-6 py-5 gap-4">
          <MaterialCommunityIcons
            name="check-decagram"
            size={50}
            color={primitiveColors['primary-500']}
          />
          <Text className="text-b1 font-sans text-grey-900 text-center">
            {t(messageKey)}
          </Text>
        </View>

        {/* Footer — compact centered Go Back button */}
        <View className="items-center pb-6">
          <View className="w-[127px]">
            <Button
              label={t('doctorAppointmentManagement.goBack')}
              variant="filled"
              size="small"
              fullWidth
              onPress={onGoBack}
            />
          </View>
        </View>
      </View>
    </View>
  );
}
