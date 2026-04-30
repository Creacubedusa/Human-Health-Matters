import { create } from 'zustand';
import type { TriageHistoryItem, TriageMessage, TriageResult, TriageSession } from '../types/triage.types';

interface TriageState {
  currentSession: TriageSession | null;
  history: TriageHistoryItem[];
  isTyping: boolean;
  startSession: () => void;
  addMessage: (msg: TriageMessage) => void;
  setTyping: (v: boolean) => void;
  setResult: (r: TriageResult) => void;
  setHistory: (h: TriageHistoryItem[]) => void;
  resetSession: () => void;
}

function newSession(): TriageSession {
  return {
    id: Math.random().toString(36).slice(2, 10),
    messages: [],
    result: null,
    startedAt: Date.now(),
  };
}

export const useTriageStore = create<TriageState>((set) => ({
  currentSession: null,
  history: [],
  isTyping: false,

  startSession: () => set({ currentSession: newSession() }),

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
      return {
        currentSession: { ...state.currentSession, result: r },
      };
    }),

  setHistory: (h) => set({ history: h }),

  resetSession: () => set({ currentSession: newSession(), isTyping: false }),
}));
