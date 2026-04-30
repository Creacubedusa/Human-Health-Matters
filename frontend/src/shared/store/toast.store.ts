import { create } from 'zustand';

export type ToastType = 'success' | 'info' | 'warning' | 'error';

export type ToastItem = {
  id: string;
  type: ToastType;
  title?: string;
  message: string;
  durationMs: number;
};

type ToastState = {
  current: ToastItem | null;
  show: (toast: Omit<ToastItem, 'id'> & { id?: string }) => void;
  hide: () => void;
};

function createId() {
  return `toast_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

export const useToastStore = create<ToastState>((set, get) => ({
  current: null,
  show: (toast) => {
    const id = toast.id ?? createId();
    set({
      current: {
        id,
        type: toast.type,
        title: toast.title,
        message: toast.message,
        durationMs: toast.durationMs ?? 3500,
      },
    });
  },
  hide: () => {
    if (!get().current) return;
    set({ current: null });
  },
}));

