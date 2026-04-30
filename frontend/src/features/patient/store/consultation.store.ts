import { create } from 'zustand';
import type {
  ActivePanel,
  AudioRoute,
  CallStatus,
  ChatMessage,
  Language,
  MockDoctor,
  TranscriptEntry,
  TranscriptionStatus,
} from '../types/consultation.types';

interface ConsultationState {
  // Session
  doctor: MockDoctor | null;
  callStatus: CallStatus;
  meetingUrl: string | null;

  // Media
  videoOn: boolean;
  muted: boolean;
  audioRoute: AudioRoute;
  audioModalOpen: boolean;
  aiNoteActive: boolean;

  // Panels
  activePanel: ActivePanel;
  endCallModalOpen: boolean;

  // Doctor chat
  doctorMessages: ChatMessage[];
  doctorInput: string;

  // AI chat
  aiMessages: ChatMessage[];
  aiInput: string;
  aiTyping: boolean;

  // Transcription
  transcriptionStatus: TranscriptionStatus;
  transcript: TranscriptEntry[];
  selectedLanguage: Language;

  // Review
  rating: number;
  reviewText: string;
  wouldRecommend: boolean | null;
  reviewSubmitting: boolean;

  // Actions
  setDoctor: (doctor: MockDoctor) => void;
  setCallStatus: (status: CallStatus) => void;
  setMeetingUrl: (url: string | null) => void;
  toggleVideo: () => void;
  toggleMute: () => void;
  setAudioRoute: (route: AudioRoute) => void;
  setAudioModalOpen: (open: boolean) => void;
  setActivePanel: (panel: ActivePanel) => void;
  setEndCallModalOpen: (open: boolean) => void;
  setDoctorInput: (text: string) => void;
  addDoctorMessage: (msg: ChatMessage) => void;
  setAiInput: (text: string) => void;
  setAiTyping: (typing: boolean) => void;
  addAiMessage: (msg: ChatMessage) => void;
  setTranscriptionStatus: (status: TranscriptionStatus) => void;
  addTranscriptEntry: (entry: TranscriptEntry) => void;
  setLanguage: (lang: Language) => void;
  setRating: (rating: number) => void;
  setReviewText: (text: string) => void;
  setWouldRecommend: (value: boolean) => void;
  setReviewSubmitting: (value: boolean) => void;
  reset: () => void;
}

const INITIAL_DOCTOR_MESSAGES: ChatMessage[] = [
  {
    id: 'd1',
    sender: 'doctor',
    text: 'Hello! I have reviewed your triage report. How are you feeling right now?',
    timestamp: new Date().toISOString(),
  },
];

const INITIAL_AI_MESSAGES: ChatMessage[] = [
  {
    id: 'a1',
    sender: 'ai',
    text: 'Hi! I am your AI health assistant. I can help clarify medical terms or answer general health questions during your consultation.',
    timestamp: new Date().toISOString(),
  },
];

export const useConsultationStore = create<ConsultationState>((set) => ({
  doctor: null,
  callStatus: 'connecting',
  meetingUrl: null,

  videoOn: true,
  muted: false,
  audioRoute: 'speaker',
  audioModalOpen: false,
  aiNoteActive: true,

  activePanel: 'none',
  endCallModalOpen: false,

  doctorMessages: INITIAL_DOCTOR_MESSAGES,
  doctorInput: '',

  aiMessages: INITIAL_AI_MESSAGES,
  aiInput: '',
  aiTyping: false,

  transcriptionStatus: 'idle',
  transcript: [],
  selectedLanguage: 'en',

  rating: 0,
  reviewText: '',
  wouldRecommend: null,
  reviewSubmitting: false,

  setDoctor: (doctor) => set({ doctor }),
  setCallStatus: (callStatus) => set({ callStatus }),
  setMeetingUrl: (meetingUrl) => set({ meetingUrl }),
  toggleVideo: () => set((s) => ({ videoOn: !s.videoOn })),
  toggleMute: () => set((s) => ({ muted: !s.muted })),
  setAudioRoute: (audioRoute) => set({ audioRoute, audioModalOpen: false }),
  setAudioModalOpen: (audioModalOpen) => set({ audioModalOpen }),
  setActivePanel: (activePanel) => set({ activePanel }),
  setEndCallModalOpen: (endCallModalOpen) => set({ endCallModalOpen }),
  setDoctorInput: (doctorInput) => set({ doctorInput }),
  addDoctorMessage: (msg) => set((s) => ({ doctorMessages: [...s.doctorMessages, msg] })),
  setAiInput: (aiInput) => set({ aiInput }),
  setAiTyping: (aiTyping) => set({ aiTyping }),
  addAiMessage: (msg) => set((s) => ({ aiMessages: [...s.aiMessages, msg] })),
  setTranscriptionStatus: (transcriptionStatus) => set({ transcriptionStatus }),
  addTranscriptEntry: (entry) => set((s) => ({ transcript: [...s.transcript, entry] })),
  setLanguage: (selectedLanguage) => set({ selectedLanguage }),
  setRating: (rating) => set({ rating }),
  setReviewText: (reviewText) => set({ reviewText }),
  setWouldRecommend: (wouldRecommend) => set({ wouldRecommend }),
  setReviewSubmitting: (reviewSubmitting) => set({ reviewSubmitting }),
  reset: () =>
    set({
      doctor: null,
      callStatus: 'connecting',
      meetingUrl: null,
      videoOn: true,
      muted: false,
      audioRoute: 'speaker',
      audioModalOpen: false,
      aiNoteActive: true,
      activePanel: 'none',
      endCallModalOpen: false,
      doctorMessages: INITIAL_DOCTOR_MESSAGES,
      doctorInput: '',
      aiMessages: INITIAL_AI_MESSAGES,
      aiInput: '',
      aiTyping: false,
      transcriptionStatus: 'idle',
      transcript: [],
      selectedLanguage: 'en',
      rating: 0,
      reviewText: '',
      wouldRecommend: null,
      reviewSubmitting: false,
    }),
}));
