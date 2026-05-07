import { useCallback, useMemo } from 'react';
import { useDoctorPatientsStore } from '../store/doctorPatients.store';
import { useDoctorNuraAIStore } from '../store/doctorNuraAI.store';
import type { DoctorAIPatient, DoctorNuraMessage } from '../types/doctorNuraAI.types';
import {
  buildHistoryItem,
  buildNuraPatientFromProfile,
  buildPatientSummaryHistoryItem,
  formatHistoryDate,
  truncateText,
} from '../utils/nuraHistory';

const MOCK_AI_RESPONSES = [
  'Based on the symptoms described, this may suggest a cardiovascular event. Requires clinician review — this is not a final diagnosis.',
  'The patient presentation is consistent with an acute condition. Immediate attention recommended. This is not a final diagnosis.',
  'Multiple symptom indicators point to a systemic issue. Further examination and lab work may be needed. Requires clinician review.',
] as const;

export function useDoctorNuraAI() {
  const store = useDoctorNuraAIStore();
  const patients = useDoctorPatientsStore((state) => state.patients);

  const patientsList = useMemo<DoctorAIPatient[]>(
    () => patients.map((patient) => buildNuraPatientFromProfile(patient)),
    [patients],
  );

  const fallbackHistoryList = useMemo(
    () =>
      patients.map((patient) =>
        buildPatientSummaryHistoryItem(patient, {
          id: `base-summary-${patient.id}`,
          snippet: truncateText(`Available AI summary for ${patient.name}`),
        }),
      ),
    [patients],
  );

  const historyList =
    store.activityHistory.length > 0 ? store.activityHistory : fallbackHistoryList;

  const viewPatientSummary = useCallback(
    (patientId: string) => {
      const patient = patients.find((item) => item.id === patientId);
      if (!patient) return null;

      const item = buildPatientSummaryHistoryItem(patient, {
        id: `summary-${patient.id}-${Date.now()}`,
        snippet: truncateText(`Reviewed AI summary for ${patient.name}`),
        sourceType: 'summary',
        date: formatHistoryDate(),
      });

      store.setSelectedSummary(item);
      store.recordHistoryItem(item);
      return item;
    },
    [patients, store],
  );

  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim()) return;

      const trimmedContent = content.trim();
      const userMsg: DoctorNuraMessage = {
        id: `user-${Date.now()}`,
        role: 'user',
        content: trimmedContent,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      store.addMessage(userMsg);
      store.setAITyping(true);

      await new Promise<void>((resolve) => setTimeout(resolve, 1500));

      const aiContent = MOCK_AI_RESPONSES[Math.floor(Math.random() * MOCK_AI_RESPONSES.length)]!;
      const aiMsg: DoctorNuraMessage = {
        id: `ai-${Date.now()}`,
        role: 'ai',
        content: aiContent,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      store.setAITyping(false);
      store.addMessage(aiMsg);

      const activePatient = store.selectedPatient;
      const historyItem = buildHistoryItem({
        id: `chat-${Date.now()}`,
        condition: activePatient?.condition ?? 'General AI Chat',
        snippet: truncateText(trimmedContent),
        summaryText: aiContent,
        patientId: activePatient?.id,
        patientName: activePatient?.patientName,
        sourceType: activePatient ? 'patient-chat' : 'general-chat',
      });
      store.recordHistoryItem(historyItem);
      if (activePatient) store.setSelectedSummary(historyItem);
    },
    [store],
  );

  const startPatientChat = useCallback(
    (patient: DoctorAIPatient) => {
      const historyItem = buildHistoryItem({
        id: `patient-chat-${patient.id}-${Date.now()}`,
        condition: patient.condition,
        snippet: truncateText(`Started Nura chat for ${patient.patientName}`),
        summaryText: patient.aiSummary,
        patientId: patient.id,
        patientName: patient.patientName,
        sourceType: 'patient-chat',
      });

      store.recordHistoryItem(historyItem);
      store.setSelectedSummary(historyItem);
      store.initPatientContextChat(patient);
    },
    [store],
  );

  const startNewChat = useCallback(() => {
    store.clearChat();
  }, [store]);

  const openReportChat = useCallback(
    (patientId?: string) => {
      const fallbackPatient =
        (patientId ? patients.find((patient) => patient.id === patientId) : null) ?? patients[0];
      if (!fallbackPatient) return null;

      const summaryItem = buildPatientSummaryHistoryItem(fallbackPatient, {
        id: `report-${fallbackPatient.id}-${Date.now()}`,
        snippet: truncateText(`Opened AI report for ${fallbackPatient.name}`),
        sourceType: 'summary',
        date: formatHistoryDate(),
      });

      store.recordHistoryItem(summaryItem);
      store.setSelectedSummary(summaryItem);
      store.initReportChat(summaryItem);
      return summaryItem;
    },
    [patients, store],
  );

  return {
    patientsList,
    historyList,
    chatMessages: store.chatMessages,
    chatMode: store.chatMode,
    selectedPatient: store.selectedPatient,
    selectedSummary: store.selectedSummary,
    isMenuOpen: store.isMenuOpen,
    isAITyping: store.isAITyping,
    openMenu: store.openMenu,
    closeMenu: store.closeMenu,
    setSelectedSummary: store.setSelectedSummary,
    viewPatientSummary,
    sendMessage,
    startPatientChat,
    startNewChat,
    openReportChat,
  };
}
