import { useEffect } from 'react';
import { useOrderStore } from '../store/order.store';
import type { OrderDetail, OrderFilter, OrderListItem, UploadedFile } from '../types/order.types';

type FetchStatus = 'idle' | 'loading' | 'error' | 'success';

const MOCK_ORDERS: OrderListItem[] = [
  { id: 'ord-001', testName: 'Blood Count', orderedBy: 'Dr. Grant Paul', date: 'Dec 12, 2024', status: 'ongoing',   priority: 'urgent' },
  { id: 'ord-002', testName: 'Blood Count', orderedBy: 'Dr. Grant Paul', date: 'Dec 12, 2024', status: 'ongoing',   priority: 'not-urgent' },
  { id: 'ord-003', testName: 'Blood Count', orderedBy: 'Dr. Grant Paul', date: 'Dec 12, 2024', status: 'ongoing',   priority: 'not-urgent' },
  { id: 'ord-004', testName: 'Blood Count', orderedBy: 'Dr. Grant Paul', date: 'Dec 12, 2024', status: 'ongoing',   priority: 'urgent' },
  { id: 'ord-005', testName: 'Lipid Panel', orderedBy: 'Dr. Grant Paul', date: 'Nov 10, 2024', status: 'completed', priority: 'not-urgent' },
  { id: 'ord-006', testName: 'Urine Analysis', orderedBy: 'Dr. Grant Paul', date: 'Oct 5, 2024', status: 'completed', priority: 'urgent' },
  { id: 'ord-007', testName: 'Thyroid Panel', orderedBy: 'Dr. Grant Paul', date: 'Sep 20, 2024', status: 'completed', priority: 'not-urgent' },
  { id: 'ord-008', testName: 'MRI Scan',    orderedBy: 'Dr. Grant Paul', date: 'Sep 1, 2024',  status: 'completed', priority: 'urgent' },
  { id: 'ord-009', testName: 'X-Ray Chest', orderedBy: 'Dr. Grant Paul', date: 'Aug 15, 2024', status: 'completed', priority: 'not-urgent' },
  { id: 'ord-010', testName: 'CT Scan',     orderedBy: 'Dr. Grant Paul', date: 'Aug 3, 2024',  status: 'completed', priority: 'urgent' },
  { id: 'ord-011', testName: 'ECG',         orderedBy: 'Dr. Grant Paul', date: 'Jul 22, 2024', status: 'completed', priority: 'not-urgent' },
  { id: 'ord-012', testName: 'HbA1c Test',  orderedBy: 'Dr. Grant Paul', date: 'Jul 10, 2024', status: 'completed', priority: 'not-urgent' },
  { id: 'ord-013', testName: 'Vitamin D',   orderedBy: 'Dr. Grant Paul', date: 'Jun 30, 2024', status: 'completed', priority: 'not-urgent' },
  { id: 'ord-014', testName: 'Stool Test',  orderedBy: 'Dr. Grant Paul', date: 'Jun 18, 2024', status: 'completed', priority: 'urgent' },
  { id: 'ord-015', testName: 'Iron Studies', orderedBy: 'Dr. Grant Paul', date: 'Jun 5, 2024', status: 'completed', priority: 'not-urgent' },
  { id: 'ord-016', testName: 'Blood Culture', orderedBy: 'Dr. Grant Paul', date: 'May 28, 2024', status: 'completed', priority: 'urgent' },
  { id: 'ord-017', testName: 'Allergy Panel', orderedBy: 'Dr. Grant Paul', date: 'May 15, 2024', status: 'completed', priority: 'not-urgent' },
  { id: 'ord-018', testName: 'Biopsy',      orderedBy: 'Dr. Grant Paul', date: 'May 3, 2024',  status: 'completed', priority: 'urgent' },
  { id: 'ord-019', testName: 'Kidney Function', orderedBy: 'Dr. Grant Paul', date: 'Apr 20, 2024', status: 'completed', priority: 'not-urgent' },
  { id: 'ord-020', testName: 'Liver Function', orderedBy: 'Dr. Grant Paul', date: 'Apr 8, 2024', status: 'completed', priority: 'not-urgent' },
];

const MOCK_DETAIL: OrderDetail = {
  id: 'ord-001',
  testName: 'Blood Count',
  orderedBy: 'Dr. Grant Paul',
  date: 'Mar 26, 2026',
  status: 'ongoing',
  priority: 'urgent',
  orderId: '12346sdsfsaae',
  patientName: 'Ayesha',
  specialisation: 'Neurology',
  additionalComment:
    'This test will help us check for any underlying issues causing your fatigue. Please complete it within the next three days so we can proceed with your treatment plan.',
  testType: 'Lab Tests',
  sampleType: 'Blood',
  collectionInstruction: 'Fast for 8 hours before sample collection.',
};

export type UseOrdersResult = {
  status: FetchStatus;
  filter: OrderFilter;
  filteredOrders: OrderListItem[];
  ongoingCount: number;
  completedCount: number;
  completionPercent: number;
  setFilter: (filter: OrderFilter) => void;
  getDetailById: (id: string) => OrderDetail | null;
  simulateUpload: () => void;
  isUploading: boolean;
  uploadSuccess: boolean;
  uploadedFile: UploadedFile | null;
  setUploadedFile: (file: UploadedFile) => void;
  clearUpload: () => void;
  retry: () => void;
};

let fetchStatus: FetchStatus = 'idle';

export function useOrders(): UseOrdersResult {
  const store = useOrderStore();

  useEffect(() => {
    if (store.orders.length > 0) return;
    fetchStatus = 'loading';
    const timer = setTimeout(() => {
      store.setOrders(MOCK_ORDERS);
      fetchStatus = 'success';
    }, 800);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const ongoingCount = store.orders.filter((o) => o.status === 'ongoing').length;
  const completedCount = store.orders.filter((o) => o.status === 'completed').length;
  const total = store.orders.length;
  const completionPercent = total === 0 ? 0 : Math.round((completedCount / total) * 100);

  const filteredOrders = store.orders.filter((o) => o.status === store.filter);

  function getDetailById(id: string): OrderDetail | null {
    if (id === MOCK_DETAIL.id) return MOCK_DETAIL;
    return null;
  }

  function simulateUpload() {
    store.setIsUploading(true);
    store.setUploadSuccess(false);
    const interval = setInterval(() => {
      store.setUploadedFile({
        name: store.uploadedFile?.name ?? 'Bloodtest.pdf',
        sizeMb: store.uploadedFile?.sizeMb ?? 10,
        progress: Math.min((store.uploadedFile?.progress ?? 0) + 20, 100),
      });
    }, 300);
    setTimeout(() => {
      clearInterval(interval);
      store.setUploadedFile({ name: 'Bloodtest.pdf', sizeMb: 10, progress: 100 });
      store.setIsUploading(false);
      store.setUploadSuccess(true);
    }, 1500);
  }

  const status: FetchStatus =
    store.orders.length > 0 ? 'success' : fetchStatus === 'idle' ? 'loading' : fetchStatus;

  return {
    status,
    filter: store.filter,
    filteredOrders,
    ongoingCount,
    completedCount,
    completionPercent,
    setFilter: store.setFilter,
    getDetailById,
    simulateUpload,
    isUploading: store.isUploading,
    uploadSuccess: store.uploadSuccess,
    uploadedFile: store.uploadedFile,
    setUploadedFile: store.setUploadedFile,
    clearUpload: store.clearUpload,
    retry: () => {
      fetchStatus = 'idle';
      store.setOrders([]);
    },
  };
}
