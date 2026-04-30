import { Modal, Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '@shared/components/ui/Button';
import { primitiveColors } from '@design/tokens';
import type { BookedAppointment } from '@features/patient/types/appointmentBooking.types';

export interface AppointmentSuccessModalProps {
  visible: boolean;
  appointment: BookedAppointment | null;
  messagePrefix: string;
  addToCalendarLabel: string;
  onClose: () => void;
  onConfirm: () => void;
}

export function AppointmentSuccessModal({
  visible,
  appointment,
  messagePrefix,
  addToCalendarLabel,
  onClose,
  onConfirm,
}: AppointmentSuccessModalProps) {
  if (!appointment) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View className="flex-1 items-center justify-center bg-grey-900/20 px-4">
        <View className="w-full max-w-[416px] rounded-lg border border-grey-200 bg-white">
          <View className="items-end px-4 pb-0 pt-4">
            <Pressable onPress={onClose} accessibilityRole="button">
              <Ionicons name="close" size={20} color={primitiveColors['grey-400']} />
            </Pressable>
          </View>

          <View className="items-center gap-4 px-6 py-5">
            <Ionicons name="checkmark-circle" size={50} color={primitiveColors['primary-500']} />
            <Text className="px-2 text-center text-b1 font-sans text-grey-900">
              {messagePrefix}{' '}
              <Text className="font-medium">
                {appointment.doctorName} on {appointment.formattedDate} at {appointment.timeLabel}
              </Text>
            </Text>
          </View>

          <View className="items-center px-6 pb-6">
            <View className="w-[127px]">
              <Button
                label={addToCalendarLabel}
                onPress={onConfirm}
                size="small"
                fullWidth
              />
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}
