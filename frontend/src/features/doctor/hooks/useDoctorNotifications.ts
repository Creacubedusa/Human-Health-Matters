import { useEffect, useState } from 'react';
import {
  fetchDoctorNotifications,
  markDoctorNotificationRead,
} from '../services/doctorNotification.service';
import { useDoctorNotificationStore } from '../store/doctorNotification.store';
import type {
  DoctorNotification,
  DoctorNotificationFilter,
} from '../types/doctorNotification.types';

type Status = 'loading' | 'error' | 'success';

interface UseDoctorNotificationsResult {
  status: Status;
  filteredNotifications: DoctorNotification[];
  activeFilter: DoctorNotificationFilter;
  setFilter: (filter: DoctorNotificationFilter) => void;
  handlePress: (id: string) => void;
  retry: () => void;
}

export function useDoctorNotifications(): UseDoctorNotificationsResult {
  const { notifications, activeFilter, setNotifications, markRead, setFilter } =
    useDoctorNotificationStore();
  const [status, setStatus] = useState<Status>(notifications.length > 0 ? 'success' : 'loading');

  const load = async () => {
    setStatus('loading');
    try {
      const data = await fetchDoctorNotifications();
      setNotifications(data);
      setStatus('success');
    } catch {
      setStatus('error');
    }
  };

  useEffect(() => {
    if (notifications.length === 0) {
      void load();
    }
  }, []);

  const filteredNotifications =
    activeFilter === 'all'
      ? notifications
      : activeFilter === 'read'
        ? notifications.filter((notification) => notification.isRead)
        : notifications.filter((notification) => !notification.isRead);

  async function handlePress(id: string) {
    markRead(id);
    await markDoctorNotificationRead(id);
  }

  return {
    status,
    filteredNotifications,
    activeFilter,
    setFilter,
    handlePress,
    retry: load,
  };
}
