import { Modal, Pressable, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { primitiveColors } from '@design/tokens';

export interface SubmissionSuccessModalProps {
  visible: boolean;
  onGoToDashboard: () => void;
  testID?: string;
}

export function SubmissionSuccessModal({
  visible,
  onGoToDashboard,
  testID,
}: SubmissionSuccessModalProps) {
  const { t } = useTranslation();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onGoToDashboard}
      testID={testID}
    >
      <View className="flex-1 bg-black/50 items-center justify-center px-6">
        <View className="bg-white rounded-lg border border-grey-200 w-full overflow-hidden">
          <View className="items-end px-4 pt-4">
            <Pressable
              onPress={onGoToDashboard}
              accessibilityRole="button"
              accessibilityLabel={t('doctorProfileSetup.success.close')}
            >
              <Ionicons name="close" size={20} color={primitiveColors['grey-500']} />
            </Pressable>
          </View>

          <View className="items-center px-6 py-5 gap-4">
            <View className="w-[50px] h-[50px] rounded-full bg-primary-500 items-center justify-center">
              <Ionicons name="checkmark" size={28} color="#ffffff" />
            </View>

            <Text className="text-b1 font-sans text-grey-900 text-center">
              {t('doctorProfileSetup.success.message')}
            </Text>

            <Pressable
              onPress={onGoToDashboard}
              disabled
              className="w-full items-center py-3 rounded-md bg-grey-200"
              accessibilityRole="button"
              accessibilityState={{ disabled: true }}
            >
              <Text className="text-btn-large font-semibold font-sans text-grey-400">
                {t('doctorProfileSetup.success.dashboardButton')}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
