import { FlatList, KeyboardAvoidingView, Modal, Platform, Pressable, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { primitiveColors } from '@design/tokens';
import { HeaderBackButton } from '@shared/components/ui/HeaderBackButton';
import type { DoctorChatMessage } from '../../types/doctorConsultation.types';

export interface DoctorPatientChatPanelProps {
  visible: boolean;
  messages: DoctorChatMessage[];
  input: string;
  patientName: string;
  patientInitials: string;
  onChangeInput: (text: string) => void;
  onSend: () => void;
  onClose: () => void;
}

interface BubbleProps { message: DoctorChatMessage; }

function Bubble({ message }: BubbleProps) {
  const isDoctor = message.sender === 'doctor';
  const time = new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

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
      <Text className="text-[12px] text-text-secondary font-sans mt-1">{time}</Text>
    </View>
  );
}

export function DoctorPatientChatPanel({
  visible,
  messages,
  input,
  patientName,
  patientInitials,
  onChangeInput,
  onSend,
  onClose,
}: DoctorPatientChatPanelProps) {
  const { t } = useTranslation();
  const displayInitials = patientInitials.slice(0, 2).toUpperCase() || 'P';

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <SafeAreaView className="flex-1 bg-white" edges={['top', 'bottom']}>
        <View className="bg-primary-50 px-4 pb-4 pt-2">
          <View className="flex-row items-center gap-4">
            <HeaderBackButton onPress={onClose} accessibilityLabel={t('common.back')} />

            <View className="flex-1 flex-row items-center gap-4">
              <View className="relative">
                <View className="w-8 h-8 rounded-full bg-primary-200 items-center justify-center">
                  <Text className="text-[12px] font-semibold font-sans text-primary-700">
                    {displayInitials}
                  </Text>
                </View>
                <View className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-green-500 border-2 border-white" />
              </View>
              <View className="gap-0.5">
                <Text className="text-c1 font-semibold font-sans text-text-primary">{patientName}</Text>
                <Text className="text-[10px] font-sans text-text-secondary">
                  {t('doctorConsultation.online')}
                </Text>
              </View>
            </View>

            <View className="w-[29px] h-[29px] shrink-0" />
          </View>
        </View>

        <KeyboardAvoidingView
          className="flex-1"
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <View className="flex-1">
            <FlatList
              data={messages}
              keyExtractor={(item) => item.id}
              contentContainerClassName="px-4 pt-3 pb-6"
              renderItem={({ item }) => <Bubble message={item} />}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            />
          </View>

          <View className="mx-3 mb-4 rounded-2xl border border-grey-300 bg-white px-4 py-3">
            <TextInput
              value={input}
              onChangeText={onChangeInput}
              placeholder={t('doctorConsultation.patientChatPlaceholder')}
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
                  accessibilityLabel={t('doctorConsultation.send')}
                >
                  <Ionicons name="send" size={16} color={primitiveColors['primary-500']} />
                </Pressable>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );
}
