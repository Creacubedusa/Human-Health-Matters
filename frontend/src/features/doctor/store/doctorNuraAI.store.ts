import { create } from 'zustand';
import type {
  DoctorAIHistoryItem,
  DoctorAIPatient,
  DoctorNuraChatMode,
  DoctorNuraMessage,
} from '../types/doctorNuraAI.types';

interface DoctorNuraAIState {
  activityHistory: DoctorAIHistoryItem[];
  chatMessages: DoctorNuraMessage[];
  chatMode: DoctorNuraChatMode;
  selectedPatient: DoctorAIPatient | null;
  selectedSummary: DoctorAIHistoryItem | null;
  isMenuOpen: boolean;
  selectedLanguage: string;
  isAITyping: boolean;

  openMenu: () => void;
  closeMenu: () => void;
  setSelectedLanguage: (lang: string) => void;
  setSelectedPatient: (patient: DoctorAIPatient | null) => void;
  setSelectedSummary: (item: DoctorAIHistoryItem | null) => void;
  setChatMode: (mode: DoctorNuraChatMode) => void;
  addMessage: (msg: DoctorNuraMessage) => void;
  clearChat: () => void;
  setAITyping: (typing: boolean) => void;
  recordHistoryItem: (item: DoctorAIHistoryItem) => void;
  initPatientContextChat: (patient: DoctorAIPatient) => void;
  initReportChat: (item: DoctorAIHistoryItem) => void;
}

export const useDoctorNuraAIStore = create<DoctorNuraAIState>((set) => ({
  activityHistory: [],
  chatMessages: [],
  chatMode: 'general',
  selectedPatient: null,
  selectedSummary: null,
  isMenuOpen: false,
  selectedLanguage: 'en',
  isAITyping: false,

  openMenu: () => set({ isMenuOpen: true }),
  closeMenu: () => set({ isMenuOpen: false }),
  setSelectedLanguage: (lang) => set({ selectedLanguage: lang }),
  setSelectedPatient: (patient) => set({ selectedPatient: patient }),
  setSelectedSummary: (item) => set({ selectedSummary: item }),
  setChatMode: (mode) => set({ chatMode: mode }),
  addMessage: (msg) => set((state) => ({ chatMessages: [...state.chatMessages, msg] })),
  clearChat: () =>
    set({
      chatMessages: [],
      chatMode: 'general',
      selectedPatient: null,
      selectedSummary: null,
    }),
  setAITyping: (typing) => set({ isAITyping: typing }),
  recordHistoryItem: (item) =>
    set((state) => ({
      activityHistory: [
        item,
        ...state.activityHistory.filter((existing) => existing.id !== item.id),
      ],
    })),

  initPatientContextChat: (patient) =>
    set({
      chatMode: 'patient-context',
      selectedPatient: patient,
      chatMessages: [
        {
          id: `ctx-${patient.id}-${Date.now()}`,
          role: 'ai',
          content: `You are now chatting about ${patient.patientName}. ${patient.aiSummary}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ],
    }),

  initReportChat: (item) =>
    set({
      chatMode: 'general',
      selectedSummary: item,
      chatMessages: [
        {
          id: `report-${item.id}`,
          role: 'ai',
          content: `Find below the AI summary report for ${item.patientName ?? item.condition}.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          showViewResult: true,
        },
      ],
    }),
}));
