import { useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { primitiveColors } from '@design/tokens';
import { InAppCallWebView } from '@shared/components/ui/InAppCallWebView';
import { AudioDeviceModal } from '@features/patient/components/consultation/AudioDeviceModal';
import { LanguageTranscriptionCard } from '@features/patient/components/consultation/LanguageTranscriptionCard';
import { useDoctorPatientsStore } from '../store/doctorPatients.store';
import { useDoctorConsultation } from '../hooks/useDoctorConsultation';
import { DoctorAINoteIndicator } from '../components/consultation/DoctorAINoteIndicator';
import { DoctorAINoteConsentModal } from '../components/consultation/DoctorAINoteConsentModal';
import { DoctorAISummaryOverlay } from '../components/consultation/DoctorAISummaryOverlay';
import { DoctorAIPatientPanel } from '../components/consultation/DoctorAIPatientPanel';
import { DoctorCallControls } from '../components/consultation/DoctorCallControls';
import { DoctorFloatingPatientCard } from '../components/consultation/DoctorFloatingPatientCard';
import { DoctorEndCallModal } from '../components/consultation/DoctorEndCallModal';
import { DoctorPatientChatPanel } from '../components/consultation/DoctorPatientChatPanel';
import { buildDoctorConsultationAISummary } from '../utils/consultationAiSummary';

function normalizeName(value: string) {
  return value.trim().toLowerCase().replace(/\s+/g, ' ');
}

export function DoctorConsultationView() {
  const { t } = useTranslation();
  const consultation = useDoctorConsultation();
  const activePatient = useDoctorPatientsStore((state) => {
    const directMatch =
      state.patients.find((patient) => patient.id === consultation.appointmentId) ?? null;
    if (directMatch) {
      return directMatch;
    }

    const targetName = normalizeName(consultation.patientName);
    return state.patients.find((patient) => normalizeName(patient.name) === targetName) ?? null;
  });
  const aiSummary = buildDoctorConsultationAISummary(activePatient);
  const [cardExpanded, setCardExpanded] = useState(false);
  const [cardTab, setCardTab] = useState<'language' | 'transcription'>('language');
  const [summaryOpen, setSummaryOpen] = useState(false);

  // ── Connecting ─────────────────────────────────────────────────────────────
  if (consultation.callStatus === 'connecting') {
    return (
      <SafeAreaView className="flex-1 bg-black items-center justify-center gap-4">
        <ActivityIndicator size="large" color={primitiveColors['primary-500']} />
        <Text className="text-b2 text-white font-sans">
          {t('doctorConsultation.connecting')}
        </Text>
      </SafeAreaView>
    );
  }

  // ── Video call active (WebView) ────────────────────────────────────────────
  if (consultation.videoOn && consultation.meetingUrl) {
    return (
      <View className="flex-1 bg-black">
        <InAppCallWebView
          url={consultation.meetingUrl}
          onBack={consultation.handleConfirmEndCall}
        />
        <DoctorAINoteIndicator active={consultation.aiNoteActive} />
        <DoctorAISummaryOverlay
          open={summaryOpen}
          summary={aiSummary}
          onToggle={() => setSummaryOpen((prev) => !prev)}
        />
        <DoctorAINoteConsentModal
          visible={consultation.aiNoteConsentVisible}
          onAccept={() => {
            consultation.setAiNoteActive(true);
            consultation.setAiNoteConsentVisible(false);
          }}
          onReject={() => {
            consultation.setAiNoteActive(false);
            consultation.setAiNoteConsentVisible(false);
          }}
        />
      </View>
    );
  }

  // ── In-call UI (video off or URL not yet ready) ───────────────────────────
  return (
    <View className="flex-1 bg-black">
      <View className="flex-1 relative">
        {consultation.videoOn ? (
          <View className="flex-1 bg-black items-center justify-center px-6 gap-4">
            <Text className="text-white text-center font-sans">
              {t('doctorConsultation.videoPoweredByDaily', { defaultValue: 'Video call powered by Daily' })}
            </Text>
            <Text className="text-white/60 text-center font-sans">
              {t('doctorConsultation.preparingCall')}
            </Text>
          </View>
        ) : (
          <View className="flex-1 bg-black items-center justify-center">
            <View className="w-44 h-44 rounded-full bg-[#814eff] items-center justify-center">
              <Text className="text-white font-['Montserrat'] font-semibold text-[80px] leading-none">
                {consultation.patientInitials.slice(0, 1).toUpperCase()}
              </Text>
            </View>
          </View>
        )}

        <DoctorAINoteIndicator active={consultation.aiNoteActive} />
        <DoctorAISummaryOverlay
          open={summaryOpen}
          summary={aiSummary}
          onToggle={() => setSummaryOpen((prev) => !prev)}
        />

        <DoctorFloatingPatientCard
          patientInitials={consultation.patientInitials}
          videoOn={consultation.videoOn}
        />

        <View className="absolute bottom-[72px] left-0 right-0 items-center gap-2">
          <Text className="text-white text-[24px] font-semibold font-sans leading-7">
            {consultation.patientName}
          </Text>
          <Text className="text-white/60 text-[16px] font-sans">
            {consultation.formattedTime}
          </Text>
        </View>

        <View className="absolute bottom-6 left-0 right-0">
          <DoctorCallControls
            muted={consultation.muted}
            videoOn={consultation.videoOn}
            onPressAudio={consultation.handleToggleAudioModal}
            onPressVideo={consultation.toggleVideo}
            onPressPatientChat={() => consultation.setActivePanel('patientChat')}
            onPressSoapAI={() => consultation.setActivePanel('soapAI')}
            onPressEndCall={() => consultation.setEndCallModalOpen(true)}
          />
        </View>
      </View>

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

      <AudioDeviceModal
        visible={consultation.audioModalOpen}
        muted={consultation.muted}
        selectedRoute={consultation.audioRoute}
        onSelectRoute={consultation.setAudioRoute}
        onToggleMute={() => consultation.setMuted(!consultation.muted)}
        onClose={() => consultation.setAudioModalOpen(false)}
      />
      <DoctorEndCallModal
        visible={consultation.endCallModalOpen}
        onConfirm={consultation.handleConfirmEndCall}
        onCancel={() => consultation.setEndCallModalOpen(false)}
      />

      <DoctorPatientChatPanel
        visible={consultation.activePanel === 'patientChat'}
        messages={consultation.patientMessages}
        input={consultation.patientInput}
        patientName={consultation.patientName}
        patientInitials={consultation.patientInitials}
        onChangeInput={consultation.setPatientInput}
        onSend={consultation.handleSendPatientMessage}
        onClose={consultation.handleClosePanel}
      />

      <DoctorAIPatientPanel
        visible={consultation.activePanel === 'soapAI'}
        patientName={consultation.patientName}
        patientInitials={consultation.patientInitials}
        summary={aiSummary}
        messages={consultation.soapAiMessages}
        input={consultation.soapAiInput}
        isTyping={consultation.soapAiTyping}
        selectedLanguage={consultation.selectedLanguage}
        onChangeInput={consultation.setSoapAiInput}
        onSend={consultation.handleSendSoapAiMessage}
        onClose={consultation.handleClosePanel}
      />

      <DoctorAINoteConsentModal
        visible={consultation.aiNoteConsentVisible}
        onAccept={() => {
          consultation.setAiNoteActive(true);
          consultation.setAiNoteConsentVisible(false);
        }}
        onReject={() => {
          consultation.setAiNoteActive(false);
          consultation.setAiNoteConsentVisible(false);
        }}
      />
    </View>
  );
}
