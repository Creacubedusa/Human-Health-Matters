import { Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { primitiveColors } from '@design/tokens';
import { Button } from '@shared/components/ui/Button';
import type { AppointmentActionType } from '../../types/appointmentManagement.types';

export interface AppointmentActionSuccessModalProps {
  visible: boolean;
  type: AppointmentActionType;
  onClose: () => void;
  onGoBack: () => void;
}

export function AppointmentActionSuccessModal({
  visible,
  type,
  onClose,
  onGoBack,
}: AppointmentActionSuccessModalProps) {
  const { t } = useTranslation();

  if (!visible) return null;

  const messageKey =
    type === 'cancel'
      ? 'appointmentManagement.cancelSuccessMessage'
      : 'appointmentManagement.rescheduleSuccessMessage';

  return (
    <View
      className="absolute inset-0 z-50 items-center justify-center px-6"
      style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
    >
      <View className="bg-white rounded-2xl w-full overflow-hidden">
        {/* Header with close */}
        <View className="h-9 items-end justify-center px-4">
          <Pressable onPress={onClose} accessibilityRole="button">
            <Ionicons name="close" size={20} color={primitiveColors['grey-600']} />
          </Pressable>
        </View>

        {/* Body */}
        <View className="items-center px-8 pb-6 gap-5">
          {/* Success icon */}
          <View className="w-[50px] h-[50px] rounded-full bg-green-50 items-center justify-center">
            <Ionicons name="checkmark-circle" size={30} color={primitiveColors['green-500']} />
          </View>

          {/* Message */}
          <Text className="text-[14px] font-sans text-grey-700 text-center leading-5">
            {t(messageKey)}
          </Text>
        </View>

        {/* Footer */}
        <View className="px-8 pb-8">
          <Button
            label={t('appointmentManagement.goBack')}
            variant="filled"
            size="medium"
            fullWidth
            onPress={onGoBack}
          />
        </View>
      </View>
    </View>
  );
}
