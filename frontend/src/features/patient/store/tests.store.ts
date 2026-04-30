import { create } from 'zustand';
import type { TestResult, TestTab } from '../types/tests.types';

interface TestsStore {
  results: TestResult[];
  activeTab: TestTab;
  setResults: (results: TestResult[]) => void;
  addResult: (result: TestResult) => void;
  setActiveTab: (tab: TestTab) => void;
}

export const useTestsStore = create<TestsStore>((set) => ({
  results: [],
  activeTab: 'lab',
  setResults: (results) => set({ results }),
  addResult: (result) => set((state) => ({ results: [result, ...state.results] })),
  setActiveTab: (tab) => set({ activeTab: tab }),
}));
