import type { Notification } from '../types/notification.types';
import { http } from '@shared/api/http';

type ApiNotification = {
  id: string;
  type: string;
  status: 'UNREAD' | 'READ';
  message: string;
  title: string;
  data: unknown;
  createdAt: string;
};

export async function fetchNotifications(): Promise<Notification[]> {
  const res = await http.get<ApiNotification[]>('/notifications');
  return res.data.map((n) => ({
    id: n.id,
    type: n.type === 'APPOINTMENT_BOOKED' ? 'appointment' : 'appointment',
    message: n.message,
    timestamp: new Date(n.createdAt).toLocaleString(),
    isRead: n.status === 'READ',
    metadata: (n.data ?? {}) as any,
  }));
}

export async function markAsRead(id: string): Promise<void> {
  await http.post(`/notifications/${id}/read`);
}
