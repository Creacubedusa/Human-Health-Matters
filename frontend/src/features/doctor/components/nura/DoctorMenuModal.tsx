import { Modal, Pressable, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { primitiveColors } from '@design/tokens';

export interface DoctorMenuModalProps {
  visible: boolean;
  onClose: () => void;
  onNewChat: () => void;
  onHistory: () => void;
  testID?: string;
}

export function DoctorMenuModal({
  visible,
  onClose,
  onNewChat,
  onHistory,
  testID,
}: DoctorMenuModalProps) {
  const { t } = useTranslation();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      testID={testID}
    >
      <Pressable
        className="flex-1 bg-black/30"
        onPress={onClose}
        accessible={false}
      >
        <View className="absolute top-36 left-4 bg-white rounded-xl shadow-400 overflow-hidden w-44">
          <Pressable
            onPress={() => { onClose(); onNewChat(); }}
            className="flex-row items-center gap-3 px-4 py-4 border-b border-grey-100"
            accessibilityRole="button"
          >
            <Ionicons name="add-circle-outline" size={18} color={primitiveColors['grey-700']} />
            <Text className="text-b3 font-sans text-grey-900">{t('doctorNuraAI.menuNewChat')}</Text>
          </Pressable>

          <Pressable
            onPress={() => { onClose(); onHistory(); }}
            className="flex-row items-center gap-3 px-4 py-4"
            accessibilityRole="button"
          >
            <Ionicons name="time-outline" size={18} color={primitiveColors['grey-700']} />
            <Text className="text-b3 font-sans text-grey-900">{t('doctorNuraAI.menuHistory')}</Text>
          </Pressable>
        </View>
      </Pressable>
    </Modal>
  );
}
