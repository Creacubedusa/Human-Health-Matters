import { FlatList, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { primitiveColors } from '@design/tokens';
import { ScreenHeader } from '@shared/components/ui/ScreenHeader';
import { ChatBubble } from '@shared/components/ui/ChatBubble';
import { TypingIndicator } from '@shared/components/ui/TypingIndicator';
import { SuggestionChip } from '@shared/components/ui/SuggestionChip';
import { useDoctorNuraAI } from '../hooks/useDoctorNuraAI';
import { useDoctorPatients } from '../hooks/useDoctorPatients';
import { DoctorAIChatInput } from '../components/nura/DoctorAIChatInput';
import { DoctorMenuModal } from '../components/nura/DoctorMenuModal';

const SUGGESTION_KEYS = ['suggestion1', 'suggestion2'] as const;

export function DoctorNuraAIChatView() {
  const { t } = useTranslation();
  const router = useRouter();
  const { patients: realPatients } = useDoctorPatients();
  const {
    chatMessages,
    chatMode,
    selectedPatient,
    isMenuOpen,
    isAITyping,
    openMenu,
    closeMenu,
    sendMessage,
    startNewChat,
    openReportChat,
  } = useDoctorNuraAI(realPatients);

  const isEmpty = chatMessages.length === 0;

  function handleNewChat() {
    startNewChat();
  }

  function handleHistory() {
    router.push('/(doctor)/nura-ai-history');
  }

  function handleViewResult() {
    openReportChat();
    router.push('/(doctor)/nura-ai-summary');
  }

  function handleSuggestion(key: string) {
    void sendMessage(t(`doctorNuraAI.${key}`));
  }

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      <ScreenHeader title={t('doctorNuraAI.title')} fallbackHref="/(doctor)/nura-ai" />

      {/* Controls bar */}
      <View className="flex-row items-center justify-between px-4 py-3">
        <Pressable
          onPress={openMenu}
          className="w-12 h-12 rounded-full bg-grey-50 items-center justify-center"
          accessibilityRole="button"
          accessibilityLabel={t('doctorNuraAI.menuLabel')}
        >
          <Ionicons name="menu-outline" size={22} color={primitiveColors['grey-700']} />
        </Pressable>

        <View className="flex-row items-center gap-2 bg-grey-50 border border-grey-300 rounded-md px-3 h-10">
          <Text className="text-c2 font-sans">🇺🇸</Text>
          <Ionicons name="chevron-down" size={14} color={primitiveColors['grey-500']} />
        </View>
      </View>

      {/* Patient context banner */}
      {chatMode === 'patient-context' && selectedPatient != null && (
        <View className="mx-4 mb-2 bg-primary-50 rounded-lg px-3 py-2 items-center">
          <Text className="text-c2 font-semibold font-sans text-grey-500">
            {t('doctorNuraAI.patientContextBanner', { name: selectedPatient.patientName })}
          </Text>
        </View>
      )}

      {/* Chat area */}
      {isEmpty ? (
        <View className="flex-1 px-4 items-center justify-center gap-6">
          <Text className="text-h5 font-semibold font-sans text-grey-900 text-center">
            {t('doctorNuraAI.howCanIHelp')}
          </Text>
          <View className="w-full gap-2">
            {SUGGESTION_KEYS.map((key) => (
              <SuggestionChip
                key={key}
                label={t(`doctorNuraAI.${key}`)}
                onPress={() => handleSuggestion(key)}
              />
            ))}
          </View>
        </View>
      ) : (
        <FlatList
          data={chatMessages}
          keyExtractor={(item) => item.id}
          className="flex-1 px-4"
          contentContainerClassName="py-4 gap-3"
          showsVerticalScrollIndicator={false}
          ListFooterComponent={isAITyping ? <TypingIndicator /> : null}
          renderItem={({ item }) => (
            <ChatBubble
              role={item.role === 'ai' ? 'ai' : 'user'}
              content={item.content}
              showViewResult={item.showViewResult}
              onViewResult={handleViewResult}
            />
          )}
        />
      )}

      {/* Chat input */}
      <View className="px-4 pb-6 pt-2">
        <DoctorAIChatInput
          onSend={sendMessage}
          disabled={isAITyping}
          testID="chat-input"
        />
      </View>

      {/* Menu modal */}
      <DoctorMenuModal
        visible={isMenuOpen}
        onClose={closeMenu}
        onNewChat={handleNewChat}
        onHistory={handleHistory}
        testID="chat-menu-modal"
      />
    </SafeAreaView>
  );
}
