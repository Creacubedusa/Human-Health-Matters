import { useEffect } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useConsultationStore } from '../store/consultation.store';
import {
  fetchConsultationSession,
  sendAIMessage,
  submitReview,
} from '../services/consultation.service';
import { useCallTimer } from './useCallTimer';
import type { ChatMessage } from '../types/consultation.types';
import { buildDailyJoinUrl, joinAppointmentVideo } from '../services/video.service';
import { fetchAppointments } from '../services/appointmentManagement.service';
import * as Linking from 'expo-linking';

function makeId(): string {
  return Math.random().toString(36).slice(2, 9);
}

function nowIso(): string {
  return new Date().toISOString();
}

export function useConsultation() {
  const router = useRouter();
  const params = useLocalSearchParams<{ appointmentId?: string }>();
  const store = useConsultationStore();
  const formattedTime = useCallTimer(store.callStatus === 'active');

  // Boot: fetch session then transition to active
  useEffect(() => {
    const controller = new AbortController();

    async function boot() {
      const session = await fetchConsultationSession();
      store.setDoctor(session.doctor);

      const appointmentIdFromParams = params.appointmentId ? String(params.appointmentId) : '';
      const appointmentId = appointmentIdFromParams || (await pickFallbackAppointmentId());
      if (!appointmentId) {
        store.setCallStatus('active');
        return;
      }

      const join = await joinAppointmentVideo(appointmentId);
      const meetingUrl = buildDailyJoinUrl(join.roomUrl, join.token);
      store.setMeetingUrl(meetingUrl);
      store.setCallStatus('active');

      if (!controller.signal.aborted) {
        void Linking.openURL(meetingUrl);
      }
    }

    void boot();

    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function pickFallbackAppointmentId() {
    const appointments = await fetchAppointments();
    const upcoming = appointments.find((a) => a.status === 'upcoming');
    return upcoming?.id ?? '';
  }

  function handleToggleAudioModal() {
    store.setAudioModalOpen(!store.audioModalOpen);
  }

  function handleOpenPanel(panel: 'doctorChat' | 'aiChat' | 'transcription') {
    store.setActivePanel(store.activePanel === panel ? 'none' : panel);
  }

  function handleClosePanel() {
    store.setActivePanel('none');
  }

  function handleSendDoctorMessage() {
    const text = store.doctorInput.trim();
    if (!text) return;
    const msg: ChatMessage = { id: makeId(), sender: 'patient', text, timestamp: nowIso() };
    store.addDoctorMessage(msg);
    store.setDoctorInput('');
    // Simulate doctor typing reply after a short delay
    setTimeout(() => {
      const reply: ChatMessage = {
        id: makeId(),
        sender: 'doctor',
        text: 'Thank you for letting me know. I will note that in your consultation record.',
        timestamp: nowIso(),
      };
      store.addDoctorMessage(reply);
    }, 1500);
  }

  function handleSendAiMessage() {
    const text = store.aiInput.trim();
    if (!text) return;
    const msg: ChatMessage = { id: makeId(), sender: 'patient', text, timestamp: nowIso() };
    store.addAiMessage(msg);
    store.setAiInput('');
    store.setAiTyping(true);
    sendAIMessage(text).then((reply) => {
      const aiMsg: ChatMessage = { id: makeId(), sender: 'ai', text: reply, timestamp: nowIso() };
      store.addAiMessage(aiMsg);
      store.setAiTyping(false);
    });
  }

  function handleStartTranscription() {
    store.setTranscriptionStatus('requesting');
    setTimeout(() => {
      store.setTranscriptionStatus('active');
      store.addTranscriptEntry({
        id: makeId(),
        speaker: 'Dr. Paul Grant',
        originalText: 'How long have you been experiencing these symptoms?',
        translatedText: '¿Cuánto tiempo llevas experimentando estos síntomas?',
        timestamp: nowIso(),
      });
      store.addTranscriptEntry({
        id: makeId(),
        speaker: 'Patient',
        originalText: 'About three days now.',
        translatedText: 'Aproximadamente tres días.',
        timestamp: nowIso(),
      });
    }, 1800);
  }

  function handleConfirmEndCall() {
    store.setEndCallModalOpen(false);
    store.setCallStatus('ended');
    router.replace('/(patient)/consultation-review');
  }

  async function handleSubmitReview() {
    if (store.rating === 0 || store.wouldRecommend === null) return;
    store.setReviewSubmitting(true);
    await submitReview({
      sessionId: store.doctor?.id ?? 'unknown',
      rating: store.rating,
      reviewText: store.reviewText,
      wouldRecommend: store.wouldRecommend,
    });
    store.setReviewSubmitting(false);
    store.reset();
    router.replace('/(patient)');
  }

  const canSubmitReview = store.rating > 0 && store.wouldRecommend !== null;

  return {
    ...store,
    formattedTime,
    canSubmitReview,
    handleToggleAudioModal,
    handleOpenPanel,
    handleClosePanel,
    handleSendDoctorMessage,
    handleSendAiMessage,
    handleStartTranscription,
    handleConfirmEndCall,
    handleSubmitReview,
  };
}
