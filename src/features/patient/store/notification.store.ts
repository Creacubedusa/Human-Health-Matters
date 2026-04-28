import { create } from 'zustand';
import type { Notification, NotificationFilter } from '../types/notification.types';

interface NotificationState {
  notifications: Notification[];
  activeFilter: NotificationFilter;
  setNotifications: (data: Notification[]) => void;
  markRead: (id: string) => void;
  setFilter: (filter: NotificationFilter) => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: [],
  activeFilter: 'all',
  setNotifications: (data) => set({ notifications: data }),
  markRead: (id) =>
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, isRead: true } : n
      ),
    })),
  setFilter: (filter) => set({ activeFilter: filter }),
}));
