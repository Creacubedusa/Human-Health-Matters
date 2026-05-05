import { FlatList, Modal, Pressable, Text, TextInput, View } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { primitiveColors } from '@design/tokens';
import { HeaderBackButton } from '@shared/components/ui/HeaderBackButton';
import { TypingIndicator } from '@shared/components/ui/TypingIndicator';
import type { DoctorChatMessage } from '../../types/doctorConsultation.types';

export interface DoctorSoapAIPanelProps {
  visible: boolean;
  messages: DoctorChatMessage[];
  input: string;
  isTyping: boolean;
  onChangeInput: (text: string) => void;
  onSend: () => void;
  onClose: () => void;
}

interface BubbleProps { message: DoctorChatMessage; }

function Bubble({ message }: BubbleProps) {
  const isDoctor = message.sender === 'doctor';

  return (
    <View className={`mb-4 ${isDoctor ? 'items-end' : 'items-start'}`}>
      <View
        className={[
          'max-w-[80%] px-4 py-3',
          isDoctor
            ? 'bg-primary-700 rounded-bl-2xl rounded-br-2xl rounded-tl-2xl rounded-tr-[6px]'
            : 'bg-grey-50 rounded-bl-2xl rounded-br-2xl rounded-tl-[6px] rounded-tr-2xl',
        ].join(' ')}
      >
        <Text className={`text-b3 font-sans leading-5 ${isDoctor ? 'text-white' : 'text-text-primary'}`}>
          {message.text}
        </Text>
      </View>
    </View>
  );
}

export function DoctorSoapAIPanel({
  visible,
  messages,
  input,
  isTyping,
  onChangeInput,
  onSend,
  onClose,
}: DoctorSoapAIPanelProps) {
  const { t } = useTranslation();

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <SafeAreaView className="flex-1 bg-white" edges={['top', 'bottom']}>
        <View className="bg-primary-50 px-4 pb-4 pt-2">
          <View className="flex-row items-center justify-between">
            <HeaderBackButton onPress={onClose} accessibilityLabel={t('common.back')} />
            <Text className="text-s2 font-semibold font-sans text-text-primary">
              {t('doctorConsultation.soapAITitle')}
            </Text>
            <View className="w-[29px] h-[29px]" />
          </View>
        </View>

        <View className="flex-row items-center justify-between px-4 py-6">
          <View className="w-12 h-12 rounded-full bg-grey-50 items-center justify-center">
            <MaterialIcons name="menu" size={26} color={primitiveColors['grey-900']} />
          </View>
        </View>

        <View className="mx-4 flex-row gap-4 items-start bg-blue-50 border border-primary-300 rounded-xl p-4">
          <Ionicons name="information-circle" size={24} color={primitiveColors['primary-500']} />
          <View className="flex-1 gap-1">
            <Text className="text-s2 font-semibold font-sans text-text-primary">
              {t('doctorConsultation.soapAIDisclaimerTitle')}
            </Text>
            <Text className="text-b3 font-sans text-text-secondary">
              {t('doctorConsultation.soapAIDisclaimerText')}
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
            placeholder={t('doctorConsultation.soapAIPlaceholder')}
            placeholderTextColor={primitiveColors['grey-400']}
            className="text-b3 text-text-secondary font-sans mb-3"
            multiline
          />
          <View className="flex-row items-center justify-end">
            <Pressable
              className="w-10 h-10 rounded-full bg-primary-50 items-center justify-center"
              onPress={onSend}
              accessibilityRole="button"
              accessibilityLabel={t('doctorConsultation.send')}
            >
              <Ionicons name="send" size={16} color={primitiveColors['primary-500']} />
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
}
