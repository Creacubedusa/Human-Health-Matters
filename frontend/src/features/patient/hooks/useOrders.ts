import { useCallback, useEffect, useState } from 'react';
import { uploadFileToCloudinary, uploadImageToCloudinary } from '@shared/api/cloudinary';
import { useOrderStore } from '../store/order.store';
import {
  fetchPatientOrderById,
  fetchPatientOrders,
  submitPatientOrderFiles,
  type ApiLabOrderFile,
} from '../services/order.service';
import type { OrderDetail, OrderFilter, OrderListItem, UploadedFile } from '../types/order.types';

type FetchStatus = 'idle' | 'loading' | 'error' | 'success';

export interface PendingFile {
  uri: string;
  name: string;
  mimeType?: string | null;
  sizeBytes?: number | null;
}

export type UseOrdersResult = {
  status: FetchStatus;
  filter: OrderFilter;
  filteredOrders: OrderListItem[];
  ongoingCount: number;
  completedCount: number;
  completionPercent: number;
  setFilter: (filter: OrderFilter) => void;
  getDetailById: (id: string) => OrderDetail | null;
  getSubmittedFilesById: (id: string) => ApiLabOrderFile[];
  fetchDetail: (id: string) => Promise<OrderDetail | null>;
  uploadAndSubmit: (orderId: string, file: PendingFile) => Promise<void>;
  isUploading: boolean;
  uploadSuccess: boolean;
  uploadedFile: UploadedFile | null;
  setUploadedFile: (file: UploadedFile) => void;
  clearUpload: () => void;
  refresh: () => Promise<void>;
  refreshing: boolean;
  retry: () => Promise<void>;
};

export function useOrders(): UseOrdersResult {
  const store = useOrderStore();
  const [status, setStatus] = useState<FetchStatus>(
    store.orders.length > 0 ? 'success' : 'idle',
  );
  const [refreshing, setRefreshing] = useState(false);
  const [details, setDetails] = useState<Record<string, OrderDetail>>({});
  const [submittedByOrder, setSubmittedByOrder] = useState<Record<string, ApiLabOrderFile[]>>(
    {},
  );

  const load = useCallback(async () => {
    try {
      const items = await fetchPatientOrders();
      store.setOrders(items);
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

  const ongoingCount = store.orders.filter((o) => o.status === 'ongoing').length;
  const completedCount = store.orders.filter((o) => o.status === 'completed').length;
  const total = store.orders.length;
  const completionPercent = total === 0 ? 0 : Math.round((completedCount / total) * 100);

  const filteredOrders = store.orders.filter((o) => o.status === store.filter);

  function getDetailById(id: string): OrderDetail | null {
    return details[id] ?? null;
  }

  function getSubmittedFilesById(id: string): ApiLabOrderFile[] {
    return submittedByOrder[id] ?? [];
  }

  async function fetchDetail(id: string): Promise<OrderDetail | null> {
    const result = await fetchPatientOrderById(id);
    if (!result) return null;
    setDetails((prev) => ({ ...prev, [id]: result.detail }));
    setSubmittedByOrder((prev) => ({ ...prev, [id]: result.submittedFiles }));
    return result.detail;
  }

  async function uploadAndSubmit(orderId: string, file: PendingFile) {
    store.setIsUploading(true);
    store.setUploadSuccess(false);
    const sizeMb = file.sizeBytes ? Number((file.sizeBytes / 1024 / 1024).toFixed(2)) : 0;
    store.setUploadedFile({ name: file.name, sizeMb, progress: 10 });
    try {
      const isImage = (file.mimeType ?? '').startsWith('image/');
      const uploaded = isImage
        ? await uploadImageToCloudinary({
            uri: file.uri,
            filename: file.name,
            mimeType: file.mimeType ?? 'image/jpeg',
            folder: 'lab-orders',
          })
        : await uploadFileToCloudinary({
            uri: file.uri,
            filename: file.name,
            mimeType: file.mimeType ?? 'application/octet-stream',
            folder: 'lab-orders',
          });
      store.setUploadedFile({ name: file.name, sizeMb, progress: 70 });

      const submitted = await submitPatientOrderFiles(orderId, [
        {
          name: file.name,
          url: uploaded.secureUrl,
          mimeType: file.mimeType ?? null,
          sizeBytes: file.sizeBytes ?? null,
        },
      ]);
      setSubmittedByOrder((prev) => ({ ...prev, [orderId]: submitted }));
      store.setUploadedFile({ name: file.name, sizeMb, progress: 100 });
      store.setUploadSuccess(true);

      store.setOrders(
        store.orders.map((o) => (o.id === orderId ? { ...o, status: 'completed' } : o)),
      );
    } catch (error) {
      store.setUploadSuccess(false);
      throw error;
    } finally {
      store.setIsUploading(false);
    }
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
    filteredOrders,
    ongoingCount,
    completedCount,
    completionPercent,
    setFilter: store.setFilter,
    getDetailById,
    getSubmittedFilesById,
    fetchDetail,
    uploadAndSubmit,
    isUploading: store.isUploading,
    uploadSuccess: store.uploadSuccess,
    uploadedFile: store.uploadedFile,
    setUploadedFile: store.setUploadedFile,
    clearUpload: store.clearUpload,
    refresh,
    refreshing,
    retry,
  };
}
