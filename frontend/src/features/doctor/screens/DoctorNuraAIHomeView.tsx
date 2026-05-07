import { FlatList, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { primitiveColors } from '@design/tokens';
import { HeaderBackButton } from '@shared/components/ui/HeaderBackButton';
import { useDoctorNuraAI } from '../hooks/useDoctorNuraAI';
import { DoctorAIChatInput } from '../components/nura/DoctorAIChatInput';
import { DoctorMenuModal } from '../components/nura/DoctorMenuModal';
import { DoctorPatientAICard } from '../components/nura/DoctorPatientAICard';
import type { DoctorAIPatient } from '../types/doctorNuraAI.types';

export function DoctorNuraAIHomeView() {
  const { t } = useTranslation();
  const router = useRouter();
  const {
    patientsList,
    isMenuOpen,
    openMenu,
    closeMenu,
    startPatientChat,
    startNewChat,
    openReportChat,
  } = useDoctorNuraAI();

  function handleNewChat() {
    startNewChat();
    router.push('/(doctor)/nura-ai-chat');
  }

  function handleHistory() {
    router.push('/(doctor)/nura-ai-history');
  }

  function handleViewResult() {
    openReportChat();
    router.push('/(doctor)/nura-ai-chat');
  }

  function handlePatientChat(patient: DoctorAIPatient) {
    startPatientChat(patient);
    router.push('/(doctor)/nura-ai-chat');
  }

  function handleViewPatient(patient: DoctorAIPatient) {
    router.push(`/(doctor)/patients/${patient.id}`);
  }

  function handleHomeSend(text: string) {
    startNewChat();
    router.push('/(doctor)/nura-ai-chat');
    // message will be sent after navigation — stub for now
    void text;
  }

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      {/* Header */}
      <View className="bg-primary-50 px-4 pb-4 pt-2">
        <View className="flex-row items-center justify-between h-[29px]">
          <HeaderBackButton
            onPress={() => router.back()}
            accessibilityLabel={t('common.back')}
          />
          <Text className="text-s2 font-semibold font-sans text-grey-900 absolute left-0 right-0 text-center pointer-events-none">
            {t('doctorNuraAI.title')}
          </Text>
          <View className="w-[29px]" />
        </View>
      </View>

      <FlatList
        data={patientsList}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerClassName="px-4 pt-4 pb-8 gap-6"
        ListHeaderComponent={
          <>
            {/* Hamburger + Language row */}
            <View className="flex-row items-center justify-between mb-2">
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

            {/* AI Report Card */}
            <View className="bg-primary-50 rounded-2xl px-3 py-6 gap-8">
              {/* Title + description */}
              <View className="flex-row items-start gap-3">
                <View className="w-6 h-6 rounded-full bg-primary-100 items-center justify-center">
                  <Ionicons name="hardware-chip-outline" size={14} color={primitiveColors['primary-500']} />
                </View>
                <View className="flex-1 gap-2">
                  <Text className="text-s2 font-semibold font-sans text-grey-900">
                    {t('doctorNuraAI.reportCardTitle')}
                  </Text>
                  <Text className="text-b3 font-sans text-grey-500">
                    {t('doctorNuraAI.reportCardDescription')}
                  </Text>
                </View>
              </View>

              {/* AI message bubble + View result */}
              <View className="items-start gap-6">
                <View className="bg-grey-50 rounded-b-2xl rounded-tr-2xl rounded-tl-sm px-4 py-3 max-w-[215px]">
                  <Text className="text-b3 font-sans text-grey-900">
                    {t('doctorNuraAI.reportCardMessage')}
                  </Text>
                </View>

                <Pressable
                  onPress={handleViewResult}
                  className="flex-row items-center gap-2 bg-primary-500 rounded-lg px-3 py-2"
                  accessibilityRole="button"
                >
                  <Text className="text-btn-small font-semibold font-sans text-white">
                    {t('doctorNuraAI.viewResult')}
                  </Text>
                  <Ionicons name="arrow-forward" size={16} color="#ffffff" />
                </Pressable>
              </View>

              {/* Chat input inside card */}
              <DoctorAIChatInput onSend={handleHomeSend} testID="home-chat-input" />
            </View>

            {/* Patients List header */}
            <View className="flex-row items-center gap-2">
              <Text className="text-s2 font-semibold font-sans text-grey-900">
                {t('doctorNuraAI.patientsListTitle')}
              </Text>
              <Ionicons name="sparkles" size={16} color={primitiveColors['primary-500']} />
            </View>
          </>
        }
        renderItem={({ item }) => (
          <DoctorPatientAICard
            patient={item}
            onChat={handlePatientChat}
            onViewPatient={handleViewPatient}
            testID={`patient-card-${item.id}`}
          />
        )}
        ItemSeparatorComponent={() => <View className="h-4" />}
      />

      {/* Menu modal */}
      <DoctorMenuModal
        visible={isMenuOpen}
        onClose={closeMenu}
        onNewChat={handleNewChat}
        onHistory={handleHistory}
        testID="menu-modal"
      />
    </SafeAreaView>
  );
}
