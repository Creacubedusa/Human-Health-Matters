import { create } from 'zustand';
import type {
  TriageHistoryItem,
  TriageMessage,
  TriageResult,
  TriageSession,
  TriageSessionMode,
} from '../types/triage.types';
import { buildTriageHistoryItem } from '../services/triage.service';

interface TriageState {
  currentSession: TriageSession | null;
  history: TriageHistoryItem[];
  isTyping: boolean;
  startSession: (mode?: TriageSessionMode) => void;
  addMessage: (msg: TriageMessage) => void;
  setTyping: (v: boolean) => void;
  setResult: (r: TriageResult) => void;
  setHistory: (h: TriageHistoryItem[]) => void;
  resetSession: (mode?: TriageSessionMode) => void;
}

function newSession(mode: TriageSessionMode = 'guided'): TriageSession {
  return {
    id: Math.random().toString(36).slice(2, 10),
    messages: [],
    result: null,
    startedAt: Date.now(),
    mode,
  };
}

export const useTriageStore = create<TriageState>((set) => ({
  currentSession: null,
  history: [],
  isTyping: false,

  startSession: (mode = 'guided') => set({ currentSession: newSession(mode), isTyping: false }),

  addMessage: (msg) =>
    set((state) => {
      if (!state.currentSession) return state;
      return {
        currentSession: {
          ...state.currentSession,
          messages: [...state.currentSession.messages, msg],
        },
      };
    }),

  setTyping: (v) => set({ isTyping: v }),

  setResult: (r) =>
    set((state) => {
      if (!state.currentSession) return state;

      const nextSession = { ...state.currentSession, result: r };
      const nextHistoryItem = buildTriageHistoryItem(nextSession, r);
      const nextHistory = [
        nextHistoryItem,
        ...state.history.filter((item) => item.id !== nextHistoryItem.id),
      ];

      return {
        currentSession: nextSession,
        history: nextHistory,
      };
    }),

  setHistory: (h) => set({ history: h }),

  resetSession: (mode = 'blank') => set({ currentSession: newSession(mode), isTyping: false }),
}));
