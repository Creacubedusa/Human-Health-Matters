import { useEffect } from 'react';
import { usePrescriptionStore } from '../store/prescription.store';
import type { PrescriptionDetail, PrescriptionFilter, PrescriptionListItem } from '../types/prescription.types';

type FetchStatus = 'idle' | 'loading' | 'error' | 'success';

// Mock data — replace with real service call when API is ready
const MOCK_PRESCRIPTIONS: PrescriptionListItem[] = [
  {
    id: 'rx-001',
    doctorName: 'Paul Grant',
    specialty: 'Cardiologist',
    licenseNo: 'MD-2019-040782',
    date: 'Dec 13, 2026',
    status: 'active',
    refillsLeft: 1,
    totalRefills: 3,
    medication: 'Amlodipine 10mg',
    rxNumber: 'RX-2026-0047',
    details: ['Dose: 1 tablet', 'Frequency: Once daily', 'Duration: 7 days', 'Route: Oral'],
  },
  {
    id: 'rx-002',
    doctorName: 'Paul Grant',
    specialty: 'Cardiologist',
    licenseNo: 'MD-2019-040782',
    date: 'Nov 10, 2026',
    status: 'inactive',
    refillsLeft: 0,
    totalRefills: 2,
    medication: 'Lisinopril 5mg',
    rxNumber: 'RX-2026-0031',
    details: ['Dose: 5mg', 'Frequency: Once daily', 'Duration: 30 days', 'Route: Oral'],
  },
];

const MOCK_DETAIL: PrescriptionDetail = {
  id: 'rx-001',
  doctorName: 'Paul Grant',
  specialty: 'Cardiologist',
  licenseNo: 'MD-2019-040782',
  date: 'Dec 13, 2026',
  status: 'active',
  refillsLeft: 1,
  totalRefills: 3,
  medication: 'Amlodipine 10mg',
  rxNumber: 'RX-2026-0047',
  brandName: 'Norvasc',
  dosage: '1 tablet',
  sig: '1 tab PO QD AM',
  issuedDate: 'Mar 26, 2026',
  expiresDate: 'Sep 26, 2026',
  directions:
    'Take ONE (1) tablet by mouth ONCE daily in the morning. May be taken with or without food.',
};

export type UsePrescriptionsResult = {
  status: FetchStatus;
  filter: PrescriptionFilter;
  filteredPrescriptions: PrescriptionListItem[];
  setFilter: (filter: PrescriptionFilter) => void;
  getDetailById: (id: string) => PrescriptionDetail | null;
  simulateDownload: () => void;
  isDownloading: boolean;
  downloadSuccess: boolean;
  clearDownloadFeedback: () => void;
  retry: () => void;
};

let fetchStatus: FetchStatus = 'idle';

export function usePrescriptions(): UsePrescriptionsResult {
  const store = usePrescriptionStore();

  useEffect(() => {
    if (store.prescriptions.length > 0) return;
    fetchStatus = 'loading';
    // Simulate async fetch
    const timer = setTimeout(() => {
      store.setPrescriptions(MOCK_PRESCRIPTIONS);
      fetchStatus = 'success';
    }, 800);
    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredPrescriptions =
    store.filter === 'all'
      ? store.prescriptions
      : store.prescriptions.filter((p) => p.status === store.filter);

  function getDetailById(id: string): PrescriptionDetail | null {
    if (id === MOCK_DETAIL.id) return MOCK_DETAIL;
    return null;
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

  const status: FetchStatus =
    store.prescriptions.length > 0
      ? 'success'
      : fetchStatus === 'idle'
        ? 'loading'
        : fetchStatus;

  return {
    status,
    filter: store.filter,
    filteredPrescriptions,
    setFilter: store.setFilter,
    getDetailById,
    simulateDownload,
    isDownloading: store.isDownloading,
    downloadSuccess: store.downloadSuccess,
    clearDownloadFeedback,
    retry: () => {
      fetchStatus = 'idle';
      store.setPrescriptions([]);
    },
  };
}
