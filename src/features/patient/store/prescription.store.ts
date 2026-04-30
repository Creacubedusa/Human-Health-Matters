import { create } from 'zustand';
import type { PrescriptionDetail, PrescriptionFilter, PrescriptionListItem } from '../types/prescription.types';

interface PrescriptionState {
  filter: PrescriptionFilter;
  prescriptions: PrescriptionListItem[];
  selectedDetail: PrescriptionDetail | null;
  isDownloading: boolean;
  downloadSuccess: boolean;
  setFilter: (filter: PrescriptionFilter) => void;
  setPrescriptions: (items: PrescriptionListItem[]) => void;
  setSelectedDetail: (detail: PrescriptionDetail | null) => void;
  setIsDownloading: (value: boolean) => void;
  setDownloadSuccess: (value: boolean) => void;
  reset: () => void;
}

export const usePrescriptionStore = create<PrescriptionState>((set) => ({
  filter: 'all',
  prescriptions: [],
  selectedDetail: null,
  isDownloading: false,
  downloadSuccess: false,
  setFilter: (filter) => set({ filter }),
  setPrescriptions: (items) => set({ prescriptions: items }),
  setSelectedDetail: (detail) => set({ selectedDetail: detail }),
  setIsDownloading: (value) => set({ isDownloading: value }),
  setDownloadSuccess: (value) => set({ downloadSuccess: value }),
  reset: () =>
    set({
      filter: 'all',
      prescriptions: [],
      selectedDetail: null,
      isDownloading: false,
      downloadSuccess: false,
    }),
}));
