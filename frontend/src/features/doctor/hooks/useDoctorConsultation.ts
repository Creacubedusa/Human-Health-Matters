import { useEffect } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { toast } from '@shared/components/ui/toast';
import { useDoctorConsultationStore } from '../store/doctorConsultation.store';
import { useDoctorNuraAIStore } from '../store/doctorNuraAI.store';
import { useDoctorPatientsStore } from '../store/doctorPatients.store';
import { buildDailyJoinUrl, joinDoctorAppointmentVideo, upsertDoctorSoapNote } from '../services/doctor.service';
import { useDoctorCallTimer } from './useDoctorCallTimer';
import type { DoctorChatMessage } from '../types/doctorConsultation.types';
import { buildHistoryItem, formatHistoryDate, getPatientCondition, truncateText } from '../utils/nuraHistory';
import { buildDoctorConsultationAISummary } from '../utils/consultationAiSummary';
import { buildPostSessionCarePlanDraft } from '../utils/postSessionCarePlan';

function makeId(): string { return Math.random().toString(36).slice(2, 9); }
function nowIso(): string { return new Date().toISOString(); }
function initialsFromName(name: string) {
  const letters = name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase());
  return letters.join('') || 'P';
}

function formatConsultationDate() {
  return new Intl.DateTimeFormat('en-US', {
    month: 'numeric',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date());
}

function buildPatientAwareAiReply(
  patientName: string,
  patientId: string,
  question: string,
) {
  const patient = useDoctorPatientsStore.getState().patients.find((item) => item.id === patientId);
  const summary = buildDoctorConsultationAISummary(patient ?? null);
  const lowerQuestion = question.toLowerCase();

  if (!summary) {
    return `I can help review ${patientName}'s consultation context. Ask about symptoms, suggested tests, or the opening clinical question.`;
  }

  if (lowerQuestion.includes('chief complaint')) {
    return `${patientName}'s chief complaint is: ${summary.chiefComplaint}`;
  }

  if (lowerQuestion.includes('test') || lowerQuestion.includes('investigation')) {
    return `Based on the current AI patient report, the proposed next test is ${summary.proposedTest}.`;
  }

  if (lowerQuestion.includes('first question') || lowerQuestion.includes('what should i ask')) {
    return `A strong opening question for ${patientName} would be: "${summary.suggestedFirstQuestion}"`;
  }

  if (lowerQuestion.includes('summary') || lowerQuestion.includes('symptom')) {
    return `Here is the AI symptom summary for ${patientName}: ${summary.aiSymptomsSummary}`;
  }

  if (lowerQuestion.includes('soap') || lowerQuestion.includes('note')) {
    return `For the SOAP note, start with Subjective around this chief complaint: ${summary.chiefComplaint} Then capture Objective findings that confirm or rule out the AI-proposed test pathway: ${summary.proposedTest}.`;
  }

  return `${patientName} is ${summary.age} years old, ${summary.height}, and ${summary.weight}. The AI symptom summary is: ${summary.aiSymptomsSummary} A sensible next step is ${summary.proposedTest}, and the suggested opening question is: "${summary.suggestedFirstQuestion}"`;
}

export function useDoctorConsultation() {
  const router = useRouter();
  const params = useLocalSearchParams<{ appointmentId?: string }>();
  const store = useDoctorConsultationStore();
  const formattedTime = useDoctorCallTimer(store.callStatus === 'active');

  useEffect(() => {
    async function boot() {
      const appointmentId = params.appointmentId ? String(params.appointmentId) : '';

      if (!appointmentId) {
        store.setCallStatus('active');
        return;
      }

      const patient = useDoctorPatientsStore.getState().patients.find((item) => item.id === appointmentId);
      if (patient) {
        store.setPatientSession(patient.name, initialsFromName(patient.name), appointmentId);
      } else {
        store.setPatientSession('Patient', 'P', appointmentId);
      }

      try {
        const join = await joinDoctorAppointmentVideo(appointmentId);
        const meetingUrl = buildDailyJoinUrl(join.roomUrl, join.token);
        store.setMeetingUrl(meetingUrl);
      } catch (e: unknown) {
        const msg = String(
          (e as { response?: { data?: { message?: string } } })?.response?.data?.message ??
          (e as Error)?.message ?? '',
        );
        if (msg.includes('too_early_to_join')) {
          toast.info('Too early to join. Try closer to the appointment time.');
        } else if (msg.includes('too_late_to_join')) {
          toast.warning('This appointment is no longer joinable.');
        } else {
          toast.error('Unable to join call. Please try again.');
        }
      }

      store.setCallStatus('active');
    }

    void boot();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function toggleMute() { store.setMuted(!store.muted); }
  function toggleVideo() { store.setVideoOn(!store.videoOn); }

  function handleToggleAudioModal() { store.setAudioModalOpen(!store.audioModalOpen); }
  function handleClosePanel() { store.setActivePanel('none'); }

  function handleStartTranscription() {
    store.setTranscriptionStatus('requesting');
    setTimeout(() => {
      store.setTranscriptionStatus('active');
      store.addTranscriptEntry({
        id: makeId(),
        speaker: 'Doctor',
        originalText: 'Can you describe how the symptoms started and how intense they feel now?',
        translatedText: 'Can you describe how the symptoms started and how intense they feel now?',
        timestamp: nowIso(),
      });
      store.addTranscriptEntry({
        id: makeId(),
        speaker: store.patientName,
        originalText: 'The pain started earlier this morning and has been getting stronger.',
        translatedText: 'The pain started earlier this morning and has been getting stronger.',
        timestamp: nowIso(),
      });
    }, 1800);
  }

  function handleSendPatientMessage() {
    const text = store.patientInput.trim();
    if (!text) return;
    const msg: DoctorChatMessage = { id: makeId(), sender: 'doctor', text, timestamp: nowIso() };
    store.addPatientMessage(msg);
    store.setPatientInput('');

    setTimeout(() => {
      const reply: DoctorChatMessage = {
        id: makeId(),
        sender: 'patient',
        text: 'Thank you, doctor. I understand.',
        timestamp: nowIso(),
      };
      store.addPatientMessage(reply);
    }, 1500);
  }

  function handleSendSoapAiMessage() {
    const text = store.soapAiInput.trim();
    if (!text) return;
    const msg: DoctorChatMessage = { id: makeId(), sender: 'doctor', text, timestamp: nowIso() };
    store.addSoapAiMessage(msg);
    store.setSoapAiInput('');
    store.setSoapAiTyping(true);

    setTimeout(() => {
      const aiReply: DoctorChatMessage = {
        id: makeId(),
        sender: 'ai',
        text: buildPatientAwareAiReply(store.patientName, store.appointmentId, text),
        timestamp: nowIso(),
      };
      store.addSoapAiMessage(aiReply);
      store.setSoapAiTyping(false);

      const patient = useDoctorPatientsStore.getState().patients.find((item) => item.id === store.appointmentId);
      useDoctorNuraAIStore.getState().recordHistoryItem(
        buildHistoryItem({
          id: `soap-ai-${store.appointmentId || 'general'}-${Date.now()}`,
          condition: patient ? getPatientCondition(patient) : 'SOAP Note Assistant',
          snippet: truncateText(text),
          summaryText: aiReply.text,
          patientId: patient?.id,
          patientName: patient?.name ?? store.patientName,
          sourceType: 'soap-note',
        }),
      );
    }, 1200);
  }

  function handleConfirmEndCall() {
    const patient = useDoctorPatientsStore
      .getState()
      .patients.find((item) => item.id === store.appointmentId);
    store.setEndCallModalOpen(false);
    store.setCallStatus('ended');
    if (patient) {
      store.setPostSessionDraft(
        buildPostSessionCarePlanDraft(
          patient,
          store.appointmentId,
          store.transcript,
          formattedTime,
          formatConsultationDate(),
          store.aiNoteActive,
        ),
      );
    }
    router.replace({
      pathname: '/(doctor)/post-session-care-plan',
    });
  }

  async function handleSubmitSoapNote() {
    if (!store.appointmentId) return;
    store.setSoapSubmitting(true);
    try {
      await upsertDoctorSoapNote(store.appointmentId, store.soap);
      const patient = useDoctorPatientsStore.getState().patients.find((item) => item.id === store.appointmentId);
      const summaryText = [
        store.soap.subjective && `Subjective: ${store.soap.subjective}`,
        store.soap.objective && `Objective: ${store.soap.objective}`,
        store.soap.assessment && `Assessment: ${store.soap.assessment}`,
        store.soap.plan && `Plan: ${store.soap.plan}`,
      ]
        .filter(Boolean)
        .join('\n\n');

      useDoctorNuraAIStore.getState().recordHistoryItem(
        buildHistoryItem({
          id: `soap-note-${store.appointmentId}-${Date.now()}`,
          condition: patient ? getPatientCondition(patient) : 'SOAP Note',
          snippet: truncateText(`Saved SOAP note for ${patient?.name ?? store.patientName}`),
          summaryText: summaryText || 'SOAP note saved from consultation workflow.',
          patientId: patient?.id,
          patientName: patient?.name ?? store.patientName,
          sourceType: 'soap-note',
          date: formatHistoryDate(),
        }),
      );
    } catch {
      toast.error('Failed to save note. Please try again.');
    } finally {
      store.setSoapSubmitting(false);
    }
    store.reset();
    router.replace('/(doctor)/consultations');
  }

  function handleSkipSoapNote() {
    store.reset();
    router.replace('/(doctor)/consultations');
  }

  return {
    ...store,
    formattedTime,
    toggleMute,
    toggleVideo,
    handleToggleAudioModal,
    handleClosePanel,
    handleSendPatientMessage,
    handleSendSoapAiMessage,
    handleStartTranscription,
    handleConfirmEndCall,
    handleSubmitSoapNote,
    handleSkipSoapNote,
  };
}
