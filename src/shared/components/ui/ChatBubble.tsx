import { Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { primitiveColors } from '@design/tokens';
import type { MessageRole, TurnOption } from '@features/patient/types/triage.types';

export interface ChatBubbleProps {
  role: MessageRole;
  content: string;
  options?: TurnOption[];
  onOptionSelect?: (value: string) => void;
  showViewResult?: boolean;
  onViewResult?: () => void;
}

export function ChatBubble({
  role,
  content,
  options,
  onOptionSelect,
  showViewResult,
  onViewResult,
}: ChatBubbleProps) {
  const { t } = useTranslation();
  const isAi = role === 'ai';

  return (
    <View className={`w-full ${isAi ? 'items-start' : 'items-end'} gap-2`}>
      <View
        className={[
          'max-w-[80%] rounded-2xl p-3',
          isAi
            ? 'bg-white border border-grey-200 rounded-tl-sm'
            : 'bg-primary-500 rounded-tr-sm',
        ].join(' ')}
      >
        <Text
          className={`text-[14px] leading-5 font-sans ${isAi ? 'text-grey-900' : 'text-white'}`}
        >
          {content}
        </Text>
      </View>

      {/* Inline option chips inside AI bubble */}
      {isAi && options && options.length > 0 && (
        <View className="flex-row flex-wrap gap-2 max-w-[80%]">
          {options.map((opt) => (
            <Pressable
              key={opt.value}
              onPress={() => onOptionSelect?.(opt.value)}
              className="border border-primary-300 bg-primary-50 rounded-full px-3 py-1.5"
              accessibilityRole="button"
            >
              <Text className="text-[13px] font-sans text-primary-600">{opt.label}</Text>
            </Pressable>
          ))}
        </View>
      )}

      {/* View Result CTA */}
      {isAi && showViewResult && (
        <View className="items-end w-full">
          <Pressable
            onPress={onViewResult}
            className="flex-row items-center gap-2 bg-primary-500 rounded-full px-4 py-2"
            accessibilityRole="button"
          >
            <Text className="text-[13px] font-semibold font-sans text-white">
              {t('nuraAI.viewResult')}
            </Text>
            <Ionicons name="arrow-forward" size={14} color={primitiveColors.white} />
          </Pressable>
        </View>
      )}
    </View>
  );
}
