import { Pressable, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { primitiveColors } from '@design/tokens';

export interface TriageChatInputProps {
  value: string;
  onChangeText: (text: string) => void;
  onSend: () => void;
  onAttachment: () => void;
  onMic: () => void;
  disabled?: boolean;
}

export function TriageChatInput({
  value,
  onChangeText,
  onSend,
  onAttachment,
  onMic,
  disabled = false,
}: TriageChatInputProps) {
  const { t } = useTranslation();

  return (
    <View className="px-4 py-3 bg-white border-t border-grey-100">
      <View className="flex-row items-center border border-grey-200 rounded-2xl px-3 py-2 gap-2">
        {/* <Pressable onPress={onAttachment} accessibilityRole="button" accessibilityLabel="Attach file">
          <Ionicons name="attach" size={22} color={primitiveColors['grey-500']} />
        </Pressable> */}

        <TextInput
          className="flex-1 text-[14px] font-sans text-grey-900 py-1"
          placeholder={t('nuraAI.placeholder')}
          placeholderTextColor={primitiveColors['grey-400']}
          value={value}
          onChangeText={onChangeText}
          multiline
          editable={!disabled}
          onSubmitEditing={onSend}
          blurOnSubmit={false}
        />

        {/* <Pressable onPress={onMic} accessibilityRole="button" accessibilityLabel="Voice input">
          <Ionicons name="mic-outline" size={22} color={primitiveColors['grey-500']} />
        </Pressable> */}

        <Pressable
          onPress={onSend}
          disabled={disabled || !value.trim()}
          className={[
            'w-9 h-9 rounded-full items-center justify-center',
            disabled || !value.trim() ? 'bg-grey-200' : 'bg-primary-500',
          ].join(' ')}
          accessibilityRole="button"
          accessibilityLabel="Send message"
        >
          <Ionicons
            name="send"
            size={16}
            color={disabled || !value.trim() ? primitiveColors['grey-400'] : primitiveColors.white}
          />
        </Pressable>
      </View>
    </View>
  );
}
