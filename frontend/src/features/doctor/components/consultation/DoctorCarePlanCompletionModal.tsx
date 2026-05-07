import { Modal, Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { primitiveColors } from '@design/tokens';

export interface DoctorCarePlanCompletionModalProps {
  visible: boolean;
  onClose: () => void;
  onScheduleFollowUp: () => void;
  onMarkCompleted: () => void;
}

export function DoctorCarePlanCompletionModal({
  visible,
  onClose,
  onScheduleFollowUp,
  onMarkCompleted,
}: DoctorCarePlanCompletionModalProps) {
  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={onClose}>
      <View className="flex-1 items-center justify-center bg-black/40 px-6">
        <View className="w-full max-w-[361px] rounded-[20px] bg-white px-5 pb-6 pt-5">
          <View className="mb-5 flex-row items-start justify-between">
            <View className="flex-1 pr-4">
              <Text className="text-[18px] font-semibold font-sans leading-7 text-grey-900">
                Care plan approved
              </Text>
              <Text className="mt-2 text-[14px] font-sans leading-5 text-grey-600">
                You can schedule a follow-up appointment or mark this consultation as completed.
              </Text>
            </View>

            <Pressable
              onPress={onClose}
              className="h-8 w-8 items-center justify-center rounded-full bg-grey-100"
              accessibilityRole="button"
              accessibilityLabel="Close care plan completion options"
            >
              <Ionicons name="close" size={18} color={primitiveColors['grey-700']} />
            </Pressable>
          </View>

          <View className="gap-3">
            <Pressable
              onPress={onScheduleFollowUp}
              className="h-12 items-center justify-center rounded-[12px] bg-primary-500 px-4"
            >
              <Text className="text-[14px] font-semibold font-sans text-white">
                Schedule follow up
              </Text>
            </Pressable>

            <Pressable
              onPress={onMarkCompleted}
              className="h-12 items-center justify-center rounded-[12px] border border-grey-300 px-4"
            >
              <Text className="text-[14px] font-semibold font-sans text-grey-900">
                Mark as completed
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
