import { FlatList, Modal, Pressable, Text, TextInput, View } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { primitiveColors } from '@design/tokens';
import { HeaderBackButton } from '@shared/components/ui/HeaderBackButton';
import { TypingIndicator } from '@shared/components/ui/TypingIndicator';
import type { ChatMessage } from '../../types/consultation.types';

export interface AIChatPanelProps {
  visible: boolean;
  messages: ChatMessage[];
  input: string;
  isTyping: boolean;
  onChangeInput: (text: string) => void;
  onSend: () => void;
  onClose: () => void;
}

interface BubbleProps {
  message: ChatMessage;
}

function Bubble({ message }: BubbleProps) {
  const isPatient = message.sender === 'patient';

  return (
    <View className={`mb-4 ${isPatient ? 'items-end' : 'items-start'}`}>
      <View
        className={[
          'max-w-[80%] px-4 py-3',
          isPatient
            ? 'bg-primary-700 rounded-bl-2xl rounded-br-2xl rounded-tl-2xl rounded-tr-[6px]'
            : 'bg-grey-50 rounded-bl-2xl rounded-br-2xl rounded-tl-[6px] rounded-tr-2xl',
        ].join(' ')}
      >
        <Text className={`text-b3 font-sans leading-5 ${isPatient ? 'text-white' : 'text-text-primary'}`}>
          {message.text}
        </Text>
      </View>
    </View>
  );
}

export function AIChatPanel({
  visible,
  messages,
  input,
  isTyping,
  onChangeInput,
  onSend,
  onClose,
}: AIChatPanelProps) {
  const { t } = useTranslation();

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <SafeAreaView className="flex-1 bg-white" edges={['top', 'bottom']}>
        <View className="bg-primary-50 px-4 pb-4 pt-2">
          <View className="flex-row items-center justify-between">
            <HeaderBackButton onPress={onClose} accessibilityLabel="Go back" />

            <Text className="text-s2 font-semibold font-sans text-text-primary">
              {t('consultation.aiChatTitle')}
            </Text>

            <View className="w-[29px] h-[29px]" />
          </View>
        </View>

        <View className="flex-row items-center justify-between px-4 py-6">
          <View className="w-12 h-12 rounded-full bg-grey-50 items-center justify-center">
            <MaterialIcons name="menu" size={26} color={primitiveColors['grey-900']} />
          </View>
          <View className="flex-row items-center gap-2 h-10 px-2.5 bg-grey-50 border border-grey-300 rounded-md">
            <Text className="text-[20px]">🇺🇸</Text>
            <Ionicons name="chevron-down" size={16} color={primitiveColors['grey-700']} />
          </View>
        </View>

        <View className="mx-4 flex-row gap-4 items-start bg-yellow-50 border border-yellow-500 rounded-xl p-4">
          <MaterialIcons name="warning-amber" size={24} color={primitiveColors['yellow-500']} />
          <View className="flex-1 gap-1">
            <Text className="text-s2 font-semibold font-sans text-text-primary">
              {t('consultation.aiDisclaimerTitle')}
            </Text>
            <Text className="text-b3 font-sans text-text-secondary">
              {t('consultation.aiDisclaimerText')}
            </Text>
          </View>
        </View>

        <FlatList
          data={messages}
          keyExtractor={(item) => item.id}
          contentContainerClassName="px-4 pt-4 pb-6"
          renderItem={({ item }) => <Bubble message={item} />}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={isTyping ? <View className="mb-4"><TypingIndicator /></View> : null}
        />

        <View className="mx-3 mb-4 rounded-2xl border border-grey-300 bg-white px-4 py-3">
          <TextInput
            value={input}
            onChangeText={onChangeInput}
            placeholder={t('consultation.aiInputPlaceholder')}
            placeholderTextColor={primitiveColors['grey-400']}
            className="text-b3 text-text-secondary font-sans mb-3"
            multiline
          />
          <View className="flex-row items-center justify-between">
            <Ionicons name="attach-outline" size={24} color={primitiveColors['grey-900']} />
            <View className="flex-row items-center gap-4">
              <Ionicons name="mic-outline" size={24} color={primitiveColors['grey-900']} />
              <Pressable
                className="w-10 h-10 rounded-full bg-primary-50 items-center justify-center"
                onPress={onSend}
                accessibilityRole="button"
                accessibilityLabel={t('consultation.send')}
              >
                <Ionicons name="send" size={16} color={primitiveColors['primary-500']} />
              </Pressable>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
}
