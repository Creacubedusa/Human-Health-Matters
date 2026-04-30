import { useEffect } from 'react';
import { useTestsStore } from '../store/tests.store';
import type { TestResult, TestTab } from '../types/tests.types';

type FetchStatus = 'idle' | 'loading' | 'success' | 'error';

const MOCK_RESULTS: TestResult[] = [
  { id: 'tst-001', fileName: 'Blood test.pdf',      fileType: 'lab',   orderedBy: 'Paul Grant', date: 'May 12, 2023' },
  { id: 'tst-002', fileName: 'Cholesterol test.pdf', fileType: 'lab',   orderedBy: 'Paul Grant', date: 'Apr 20, 2023' },
  { id: 'tst-003', fileName: 'CBC report.pdf',       fileType: 'lab',   orderedBy: 'Paul Grant', date: 'Mar 15, 2023' },
  { id: 'tst-004', fileName: 'Ultrasound.jpg',       fileType: 'image', orderedBy: 'Paul Grant', date: 'May 12, 2023' },
  { id: 'tst-005', fileName: 'X-Ray chest.jpg',      fileType: 'image', orderedBy: 'Paul Grant', date: 'Apr 5, 2023'  },
  { id: 'tst-006', fileName: 'MRI scan.jpg',         fileType: 'image', orderedBy: 'Paul Grant', date: 'Feb 28, 2023' },
];

const MOCK_UPLOAD_METADATA = {
  orderedBy: 'Paul Grant',
  date: 'May 12, 2023',
};

export type UseTestsResult = {
  status: FetchStatus;
  activeTab: TestTab;
  filteredResults: TestResult[];
  uploadMetadata: typeof MOCK_UPLOAD_METADATA;
  setActiveTab: (tab: TestTab) => void;
  simulateUpload: (tab: TestTab) => void;
  retry: () => void;
};

let fetchStatus: FetchStatus = 'idle';

export function useTests(): UseTestsResult {
  const store = useTestsStore();

  useEffect(() => {
    if (store.results.length > 0) return;
    fetchStatus = 'loading';
    const timer = setTimeout(() => {
      store.setResults(MOCK_RESULTS);
      fetchStatus = 'success';
    }, 800);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredResults = store.results.filter((r) =>
    store.activeTab === 'lab' ? r.fileType === 'lab' : r.fileType === 'image',
  );

  function simulateUpload(tab: TestTab) {
    const isLab = tab === 'lab';
    const now = new Date();
    const formatted = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    store.addResult({
      id: `tst-${Date.now()}`,
      fileName: isLab ? `Lab result ${now.getTime()}.pdf` : `Image ${now.getTime()}.jpg`,
      fileType: isLab ? 'lab' : 'image',
      orderedBy: 'Paul Grant',
      date: formatted,
    });
  }

  const status: FetchStatus =
    store.results.length > 0 ? 'success' : fetchStatus === 'idle' ? 'loading' : fetchStatus;

  return {
    status,
    activeTab: store.activeTab,
    filteredResults,
    uploadMetadata: MOCK_UPLOAD_METADATA,
    setActiveTab: store.setActiveTab,
    simulateUpload,
    retry: () => {
      fetchStatus = 'idle';
      store.setResults([]);
    },
  };
}
