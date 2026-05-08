import { useCallback, useEffect, useState } from 'react';
import { usePrescriptionStore } from '../store/prescription.store';
import {
  fetchPatientPrescriptionById,
  fetchPatientPrescriptions,
} from '../services/prescription.service';
import type { PrescriptionDetail, PrescriptionFilter, PrescriptionListItem } from '../types/prescription.types';

type FetchStatus = 'idle' | 'loading' | 'error' | 'success';

export type UsePrescriptionsResult = {
  status: FetchStatus;
  filter: PrescriptionFilter;
  filteredPrescriptions: PrescriptionListItem[];
  setFilter: (filter: PrescriptionFilter) => void;
  getDetailById: (id: string) => PrescriptionDetail | null;
  fetchDetail: (id: string) => Promise<PrescriptionDetail | null>;
  simulateDownload: () => void;
  isDownloading: boolean;
  downloadSuccess: boolean;
  clearDownloadFeedback: () => void;
  refresh: () => Promise<void>;
  refreshing: boolean;
  retry: () => Promise<void>;
};

export function usePrescriptions(): UsePrescriptionsResult {
  const store = usePrescriptionStore();
  const [status, setStatus] = useState<FetchStatus>(
    store.prescriptions.length > 0 ? 'success' : 'idle',
  );
  const [refreshing, setRefreshing] = useState(false);
  const [details, setDetails] = useState<Record<string, PrescriptionDetail>>({});

  const load = useCallback(async () => {
    try {
      const items = await fetchPatientPrescriptions();
      store.setPrescriptions(items);
      setStatus('success');
    } catch {
      setStatus('error');
    }
  }, [store]);

  useEffect(() => {
    if (status !== 'idle') return;
    setStatus('loading');
    void load();
  }, [load, status]);

  const filteredPrescriptions =
    store.filter === 'all'
      ? store.prescriptions
      : store.prescriptions.filter((p) => p.status === store.filter);

  function getDetailById(id: string): PrescriptionDetail | null {
    return details[id] ?? null;
  }

  async function fetchDetail(id: string): Promise<PrescriptionDetail | null> {
    if (details[id]) return details[id];
    const detail = await fetchPatientPrescriptionById(id);
    if (detail) {
      setDetails((prev) => ({ ...prev, [id]: detail }));
    }
    return detail;
  }

  function simulateDownload() {
    store.setIsDownloading(true);
    store.setDownloadSuccess(false);
    setTimeout(() => {
      store.setIsDownloading(false);
      store.setDownloadSuccess(true);
    }, 1500);
  }

  function clearDownloadFeedback() {
    store.setDownloadSuccess(false);
  }

  async function refresh() {
    setRefreshing(true);
    try {
      await load();
    } finally {
      setRefreshing(false);
    }
  }

  async function retry() {
    setStatus('loading');
    await load();
  }

  return {
    status,
    filter: store.filter,
    filteredPrescriptions,
    setFilter: store.setFilter,
    getDetailById,
    fetchDetail,
    simulateDownload,
    isDownloading: store.isDownloading,
    downloadSuccess: store.downloadSuccess,
    clearDownloadFeedback,
    refresh,
    refreshing,
    retry,
  };
}
