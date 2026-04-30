import { useToastStore, type ToastType } from '@shared/store/toast.store';

type ToastArgs = {
  type: ToastType;
  message: string;
  title?: string;
  durationMs?: number;
};

export const toast = {
  show: (args: ToastArgs) => {
    useToastStore.getState().show({
      type: args.type,
      title: args.title,
      message: args.message,
      durationMs: args.durationMs ?? 3500,
    });
  },
  success: (message: string, title?: string) => toast.show({ type: 'success', message, title }),
  info: (message: string, title?: string) => toast.show({ type: 'info', message, title }),
  warning: (message: string, title?: string) => toast.show({ type: 'warning', message, title }),
  error: (message: string, title?: string) => toast.show({ type: 'error', message, title }),
};

