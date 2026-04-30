import { Modal, Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { primitiveColors } from '@design/tokens';

export interface TriageMenuModalProps {
  visible: boolean;
  onClose: () => void;
  onNewChat: () => void;
  onHistory: () => void;
}

export function TriageMenuModal({ visible, onClose, onNewChat, onHistory }: TriageMenuModalProps) {
  const { t } = useTranslation();

  return (
    <Modal transparent animationType="fade" visible={visible} onRequestClose={onClose}>
      <View className="flex-1 bg-black/20">
        <Pressable className="absolute inset-0" onPress={onClose} accessibilityRole="button" />

        {/* Card anchored top-left below the sub-bar (~210px from top) */}
        <View
          className="absolute overflow-hidden rounded-xl bg-white shadow-300"
          style={{ top: 210, left: 16, width: 157 }}
        >
          <Pressable
            onPress={() => {
              onNewChat();
            }}
            className="flex-row items-center gap-3 px-3 py-3 active:bg-grey-50"
            accessibilityRole="button"
          >
            <Ionicons name="chatbubble-outline" size={20} color={primitiveColors['grey-700']} />
            <Text className="text-[14px] font-sans text-grey-900">{t('nuraAI.menuNewChat')}</Text>
          </Pressable>

          <View className="mx-3 h-px bg-grey-100" />

          <Pressable
            onPress={() => {
              onClose();
              onHistory();
            }}
            className="flex-row items-center gap-3 px-3 py-3 active:bg-grey-50"
            accessibilityRole="button"
          >
            <Ionicons name="time-outline" size={20} color={primitiveColors['grey-700']} />
            <Text className="text-[14px] font-sans text-grey-900">{t('nuraAI.menuHistory')}</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}
