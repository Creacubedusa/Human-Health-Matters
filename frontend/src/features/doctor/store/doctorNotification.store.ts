import { create } from 'zustand';
import type {
  DoctorNotification,
  DoctorNotificationFilter,
} from '../types/doctorNotification.types';

interface DoctorNotificationState {
  notifications: DoctorNotification[];
  activeFilter: DoctorNotificationFilter;
  setNotifications: (data: DoctorNotification[]) => void;
  markRead: (id: string) => void;
  setFilter: (filter: DoctorNotificationFilter) => void;
}

export const useDoctorNotificationStore = create<DoctorNotificationState>((set) => ({
  notifications: [],
  activeFilter: 'all',
  setNotifications: (data) => set({ notifications: data }),
  markRead: (id) =>
    set((state) => ({
      notifications: state.notifications.map((notification) =>
        notification.id === id ? { ...notification, isRead: true } : notification,
      ),
    })),
  setFilter: (filter) => set({ activeFilter: filter }),
}));
