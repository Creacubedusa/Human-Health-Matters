import { create } from 'zustand';
import type { OrderFilter, OrderListItem, UploadedFile } from '../types/order.types';

interface OrderStore {
  orders: OrderListItem[];
  filter: OrderFilter;
  uploadedFile: UploadedFile | null;
  isUploading: boolean;
  uploadSuccess: boolean;
  setOrders: (orders: OrderListItem[]) => void;
  setFilter: (filter: OrderFilter) => void;
  setUploadedFile: (file: UploadedFile | null) => void;
  clearUpload: () => void;
  setIsUploading: (value: boolean) => void;
  setUploadSuccess: (value: boolean) => void;
}

export const useOrderStore = create<OrderStore>((set) => ({
  orders: [],
  filter: 'ongoing',
  uploadedFile: null,
  isUploading: false,
  uploadSuccess: false,
  setOrders: (orders) => set({ orders }),
  setFilter: (filter) => set({ filter }),
  setUploadedFile: (file) => set({ uploadedFile: file }),
  clearUpload: () => set({ uploadedFile: null, uploadSuccess: false }),
  setIsUploading: (value) => set({ isUploading: value }),
  setUploadSuccess: (value) => set({ uploadSuccess: value }),
}));
