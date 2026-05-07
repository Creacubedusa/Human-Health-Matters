import { useEffect, useState } from 'react';
import { fetchNotifications, markAsRead } from '../services/notification.service';
import { useNotificationStore } from '../store/notification.store';
import type { Notification, NotificationFilter } from '../types/notification.types';

type Status = 'loading' | 'error' | 'success';

interface UseNotificationsResult {
  status: Status;
  hasNotifications: boolean;
  filteredNotifications: Notification[];
  activeFilter: NotificationFilter;
  setFilter: (filter: NotificationFilter) => void;
  handlePress: (id: string) => void;
  retry: () => void;
}

export function useNotifications(): UseNotificationsResult {
  const { notifications, activeFilter, setNotifications, markRead, setFilter } =
    useNotificationStore();
  const [status, setStatus] = useState<Status>(
    notifications.length > 0 ? 'success' : 'loading'
  );

  const load = async () => {
    setStatus('loading');
    try {
      const data = await fetchNotifications();
      setNotifications(data);
      setStatus('success');
    } catch {
      setStatus('error');
    }
  };

  useEffect(() => {
    if (notifications.length === 0) load();
  }, []);

  const filteredNotifications =
    activeFilter === 'all'
      ? notifications
      : activeFilter === 'read'
      ? notifications.filter((n) => n.isRead)
      : notifications.filter((n) => !n.isRead);

  async function handlePress(id: string) {
    markRead(id);
    await markAsRead(id);
  }

  return {
    status,
    hasNotifications: notifications.length > 0,
    filteredNotifications,
    activeFilter,
    setFilter,
    handlePress,
    retry: load,
  };
}
