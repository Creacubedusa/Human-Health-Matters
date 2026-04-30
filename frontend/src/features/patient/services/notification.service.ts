import type { Notification } from '../types/notification.types';
import { http } from '@shared/api/http';
import { z } from 'zod';

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
  const metaSchema = z
    .object({
      appointmentId: z.string().optional(),
      reportId: z.string().optional(),
      orderId: z.string().optional(),
      doctorName: z.string().optional(),
    })
    .passthrough();

  return res.data.map((n) => ({
    id: n.id,
    type: n.type === 'APPOINTMENT_BOOKED' ? 'appointment' : 'appointment',
    message: n.message,
    timestamp: new Date(n.createdAt).toLocaleString(),
    isRead: n.status === 'READ',
    metadata: (() => {
      const parsed = metaSchema.safeParse(n.data ?? {});
      return parsed.success ? parsed.data : {};
    })(),
  }));
}

export async function markAsRead(id: string): Promise<void> {
  await http.post(`/notifications/${id}/read`);
}
