import { useState } from 'react';
import { Pressable, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { primitiveColors } from '@design/tokens';

export interface DoctorAIChatInputProps {
  onSend: (text: string) => void;
  disabled?: boolean;
  testID?: string;
}

export function DoctorAIChatInput({ onSend, disabled = false, testID }: DoctorAIChatInputProps) {
  const { t } = useTranslation();
  const [text, setText] = useState('');

  function handleSend() {
    if (!text.trim() || disabled) return;
    onSend(text.trim());
    setText('');
  }

  return (
    <View
      className="bg-white border border-grey-300 rounded-2xl px-4 py-3 gap-4"
      testID={testID}
    >


      <View className="flex-row items-center gap-2">
        {/* <Pressable
          accessibilityRole="button"
          accessibilityLabel={t('doctorNuraAI.attachmentLabel')}
          className="opacity-80"
        >
          <Ionicons name="attach-outline" size={22} color={primitiveColors['grey-700']} />
        </Pressable> */}
        <TextInput
          value={text}
          onChangeText={setText}
          placeholder={t('doctorNuraAI.chatPlaceholder')}
          placeholderTextColor={primitiveColors['grey-400']}
          className="flex-1 text-b3 font-sans text-grey-900 p-0"
          multiline={false}
          editable={!disabled}
          onSubmitEditing={handleSend}
          returnKeyType="send"
          accessibilityLabel={t('doctorNuraAI.chatPlaceholder')}
        />
        <View className="flex-row items-center gap-4">
          {/* <Pressable
            accessibilityRole="button"
            accessibilityLabel={t('doctorNuraAI.micLabel')}
            className="opacity-80"
          >
            <Ionicons name="mic-outline" size={22} color={primitiveColors['grey-700']} />
          </Pressable> */}

          <Pressable
            onPress={handleSend}
            disabled={disabled || !text.trim()}
            className="w-10 h-10 rounded-full bg-primary-50 items-center justify-center"
            accessibilityRole="button"
            accessibilityLabel={t('doctorNuraAI.sendLabel')}
          >
            <Ionicons
              name="send"
              size={16}
              color={
                text.trim() && !disabled
                  ? primitiveColors['primary-500']
                  : primitiveColors['grey-400']
              }
            />
          </Pressable>
        </View>
      </View>
    </View>
  );
}
