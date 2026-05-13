import { useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  InteractionManager,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { primitiveColors } from '@design/tokens';
import { HeaderBackButton } from '@shared/components/ui/HeaderBackButton';
import { useTriage } from '../hooks/useTriage';
import { TriageChatInput } from '../components/TriageChatInput';
import { TriageMenuModal } from '../components/TriageMenuModal';
import { ChatBubble } from '@shared/components/ui/ChatBubble';
import { SuggestionChip } from '@shared/components/ui/SuggestionChip';
import { TypingIndicator } from '@shared/components/ui/TypingIndicator';
import type { TriageResult } from '../types/triage.types';

export interface NuraTriageViewProps {
  onBack: () => void;
  onLanguage: () => void;
  onHistory: () => void;
  onViewResult: (result: TriageResult) => void;
}

// Header (66px) + Sub-bar (48px) = 114px above the KeyboardAvoidingView
const IOS_KEYBOARD_OFFSET = 114;

export function NuraTriageView({
  onBack,
  onLanguage,
  onHistory,
  onViewResult,
}: NuraTriageViewProps) {
  const { t } = useTranslation();
  const { hasSession, messages, isTyping, result, sendMessage, resetSession } = useTriage();
  const [inputText, setInputText] = useState('');
  const [menuVisible, setMenuVisible] = useState(false);
  const listRef = useRef<FlatList>(null);

  const isLoading = !hasSession;
  const isEmpty = hasSession && messages.length === 0 && isTyping === false;

  function handleSend() {
    if (!inputText.trim()) return;
    sendMessage(inputText.trim());
    setInputText('');
    setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 100);
  }

  function handleSuggestion(text: string) {
    sendMessage(text);
    setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 100);
  }

  function handleOptionSelect(value: string) {
    sendMessage(value.replace(/_/g, ' '));
    setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 100);
  }

  function handleNewChat() {
    setMenuVisible(false);
    setInputText('');

    InteractionManager.runAfterInteractions(() => {
      resetSession();
      setTimeout(() => listRef.current?.scrollToOffset({ animated: false, offset: 0 }), 50);
    });
  }

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      {/* Header */}
      <View className="bg-primary-50 h-[66px] justify-end">
        <View className="h-[48px] flex-row items-center justify-between px-4 pb-3">
          <HeaderBackButton onPress={onBack} accessibilityLabel={t('common.back')} />

          <Text className="text-[16px] font-semibold font-sans text-grey-900">
            {t('nuraAI.headerTitle')}
          </Text>

          <View style={{ width: 29 }} />
        </View>
      </View>

      {/* Sub-bar */}
      <View className="flex-row items-center justify-between px-5 h-[48px] border-b border-grey-100">
        <Pressable
          onPress={() => setMenuVisible(true)}
          className="w-[48px] h-[48px] items-center justify-center"
          accessibilityRole="button"
          accessibilityLabel="Menu"
        >
          <Ionicons name="menu" size={24} color={primitiveColors['grey-700']} />
        </Pressable>

        <Pressable
          onPress={onLanguage}
          className="flex-row items-center gap-1 border border-grey-300 rounded-md h-[40px] px-2.5"
          accessibilityRole="button"
          accessibilityLabel="Change language"
        >
          <Text className="text-[16px]">🇺🇸</Text>
          <Ionicons name="chevron-down" size={12} color={primitiveColors['grey-600']} />
        </Pressable>
      </View>

      <KeyboardAvoidingView
        className="flex-1"
        behavior="padding"
        keyboardVerticalOffset={Platform.OS === 'ios' ? IOS_KEYBOARD_OFFSET : 0}
      >
        {/* Loading */}
        {isLoading && (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color={primitiveColors['primary-500']} />
          </View>
        )}

        {/* Empty state — first load before first AI message */}
        {isEmpty && (
          <View className="flex-1 items-center justify-center px-8 gap-6">
            <Text className="text-[22px] font-bold font-sans text-grey-900 text-center">
              {t('nuraAI.howCanIHelp')}
            </Text>
            <View className="w-full gap-3">
              <SuggestionChip
                label={t('nuraAI.suggestion1')}
                onPress={() => handleSuggestion(t('nuraAI.suggestion1'))}
              />
              <SuggestionChip
                label={t('nuraAI.suggestion2')}
                onPress={() => handleSuggestion(t('nuraAI.suggestion2'))}
              />
            </View>
          </View>
        )}

        {/* Chat list */}
        {messages.length > 0 && (
          <FlatList
            ref={listRef}
            className="flex-1"
            contentContainerClassName="px-4 py-4 gap-4"
            data={messages}
            keyExtractor={(item) => item.id}
            keyboardShouldPersistTaps="handled"
            onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: false })}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <ChatBubble
                role={item.role}
                content={item.content}
                options={item.options}
                onOptionSelect={handleOptionSelect}
                showViewResult={item.showViewResult}
                onViewResult={() => result && onViewResult(result)}
              />
            )}
            ListFooterComponent={
              isTyping ? (
                <View className="mt-2">
                  <TypingIndicator />
                </View>
              ) : null
            }
          />
        )}

        {/* Chat input */}
        <TriageChatInput
          value={inputText}
          onChangeText={setInputText}
          onSend={handleSend}
          onAttachment={() => { }}
          onMic={() => { }}
          disabled={isTyping}
        />
      </KeyboardAvoidingView>

      {/* Menu modal */}
      <TriageMenuModal
        visible={menuVisible}
        onClose={() => setMenuVisible(false)}
        onNewChat={handleNewChat}
        onHistory={onHistory}
      />
    </SafeAreaView>
  );
}
