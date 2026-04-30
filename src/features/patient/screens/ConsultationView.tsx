import { useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { primitiveColors } from '@design/tokens';
import { useConsultation } from '../hooks/useConsultation';
import { AINoteIndicator } from '../components/consultation/AINoteIndicator';
import { FloatingDoctorCard } from '../components/consultation/FloatingDoctorCard';
import { CallControls } from '../components/consultation/CallControls';
import { AudioDeviceModal } from '../components/consultation/AudioDeviceModal';
import { EndCallModal } from '../components/consultation/EndCallModal';
import { DoctorChatPanel } from '../components/consultation/DoctorChatPanel';
import { AIChatPanel } from '../components/consultation/AIChatPanel';
import { LanguageTranscriptionCard } from '../components/consultation/LanguageTranscriptionCard';

const PATIENT_NAME = 'Ayesha';
const PATIENT_INITIALS = 'A';

export function ConsultationView() {
  const { t } = useTranslation();
  const consultation = useConsultation();

  // Card drawer state — hoisted here so ConsultationView owns it
  const [cardExpanded, setCardExpanded] = useState(false);
  const [cardTab, setCardTab] = useState<'language' | 'transcription'>('language');

  if (consultation.callStatus === 'connecting') {
    return (
      <SafeAreaView className="flex-1 bg-black items-center justify-center gap-4">
        <ActivityIndicator size="large" color={primitiveColors['primary-500']} />
        <Text className="text-b2 text-white font-sans">{t('consultation.connecting')}</Text>
      </SafeAreaView>
    );
  }

  return (
    <View className="flex-1 bg-black">

      {/* ── Video area ─────────────────────────────────── */}
      <View className="flex-1 relative">
        {consultation.videoOn ? (
          <View className="flex-1 bg-black" />
        ) : (
          <View className="flex-1 bg-black items-center justify-center">
            <View className="w-44 h-44 rounded-full bg-[#814eff] items-center justify-center">
              <Text className="text-white font-['Montserrat'] font-semibold text-[80px] leading-none">
                {PATIENT_INITIALS}
              </Text>
            </View>
          </View>
        )}

        {/* AI note indicator (top-left) */}
        <AINoteIndicator active={consultation.aiNoteActive} />

        {/* Floating doctor card (top-right) */}
        {consultation.doctor && (
          <FloatingDoctorCard
            doctorName={consultation.doctor.name}
            avatarInitials={consultation.doctor.avatarInitials}
            videoOn={consultation.videoOn}
          />
        )}

        {/* Patient name + timer — centered */}
        <View className="absolute bottom-[72px] left-0 right-0 items-center gap-2">
          <Text className="text-white text-[24px] font-semibold font-sans leading-7">
            {PATIENT_NAME}
          </Text>
          <Text className="text-white/60 text-[16px] font-sans">
            {consultation.formattedTime}
          </Text>
        </View>

        {/* Call controls — centred at bottom of video */}
        <View className="absolute bottom-6 left-0 right-0">
          <CallControls
            muted={consultation.muted}
            videoOn={consultation.videoOn}
            onPressAudio={consultation.handleToggleAudioModal}
            onPressVideo={consultation.toggleVideo}
            onPressDoctorChat={() => consultation.setActivePanel('doctorChat')}
            onPressAiChat={() => consultation.setActivePanel('aiChat')}
            onPressEndCall={() => consultation.setEndCallModalOpen(true)}
          />
        </View>
      </View>

      {/* ── Language / Transcription card ──────────────── */}
      <View className="bg-black">
        <LanguageTranscriptionCard
          selectedLanguage={consultation.selectedLanguage}
          transcriptionStatus={consultation.transcriptionStatus}
          transcript={consultation.transcript}
          onSelectLanguage={consultation.setLanguage}
          onStartTranscription={consultation.handleStartTranscription}
          expanded={cardExpanded}
          onToggleExpanded={() => setCardExpanded((prev) => !prev)}
          activeTab={cardTab}
          onTabChange={setCardTab}
        />
        <SafeAreaView edges={['bottom']} className="bg-black" />
      </View>

      {/* ── Modals ─────────────────────────────────────── */}
      <AudioDeviceModal
        visible={consultation.audioModalOpen}
        muted={consultation.muted}
        selectedRoute={consultation.audioRoute}
        onSelectRoute={consultation.setAudioRoute}
        onToggleMute={consultation.toggleMute}
        onClose={() => consultation.setAudioModalOpen(false)}
      />
      <EndCallModal
        visible={consultation.endCallModalOpen}
        onConfirm={consultation.handleConfirmEndCall}
        onCancel={() => consultation.setEndCallModalOpen(false)}
      />

      {/* ── Full-screen chat panels (Modals) ───────────── */}
      <DoctorChatPanel
        visible={consultation.activePanel === 'doctorChat'}
        messages={consultation.doctorMessages}
        input={consultation.doctorInput}
        doctorName={consultation.doctor?.name ?? 'Doctor'}
        onChangeInput={consultation.setDoctorInput}
        onSend={consultation.handleSendDoctorMessage}
        onClose={consultation.handleClosePanel}
      />
      <AIChatPanel
        visible={consultation.activePanel === 'aiChat'}
        messages={consultation.aiMessages}
        input={consultation.aiInput}
        isTyping={consultation.aiTyping}
        onChangeInput={consultation.setAiInput}
        onSend={consultation.handleSendAiMessage}
        onClose={consultation.handleClosePanel}
      />
    </View>
  );
}
