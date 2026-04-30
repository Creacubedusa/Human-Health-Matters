import { Modal, Pressable, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

export interface EndCallModalProps {
  visible: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function EndCallModal({ visible, onConfirm, onCancel }: EndCallModalProps) {
  const { t } = useTranslation();

  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={onCancel}>
      <View className="flex-1 bg-black/60 items-center justify-center px-6">
        <View className="bg-white rounded-2xl p-6 w-full">
          <Text className="text-s1 text-text-primary font-sans text-center mb-2">
            {t('consultation.endCallTitle')}
          </Text>
          <Text className="text-b2 text-text-secondary font-sans text-center mb-6">
            {t('consultation.endCallSubtitle')}
          </Text>
          <View className="flex-row gap-3">
            <Pressable
              className="flex-1 py-3 rounded-md border border-grey-300 items-center"
              onPress={onCancel}
              accessibilityRole="button"
            >
              <Text className="text-btn-medium font-semibold font-sans text-text-primary">
                {t('consultation.cancel')}
              </Text>
            </Pressable>
            <Pressable
              className="flex-1 py-3 rounded-md bg-red-500 items-center"
              onPress={onConfirm}
              accessibilityRole="button"
            >
              <Text className="text-btn-medium font-semibold font-sans text-white">
                {t('consultation.endCallConfirm')}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
