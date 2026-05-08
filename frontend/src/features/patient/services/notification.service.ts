import type { Notification, NotificationType } from '../types/notification.types';
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

const metaSchema = z
  .object({
    appointmentId: z.string().nullable().optional(),
    reportId: z.string().optional(),
    orderId: z.string().optional(),
    labOrderId: z.string().optional(),
    prescriptionIds: z.array(z.string()).optional(),
    doctorName: z.string().optional(),
  })
  .passthrough();

function mapType(apiType: string): NotificationType {
  switch (apiType) {
    case 'APPOINTMENT_BOOKED':
    case 'APPOINTMENT_RESCHEDULED':
    case 'APPOINTMENT_CANCELLED':
      return 'appointment';
    case 'LAB_ORDER_CREATED':
    case 'LAB_ORDER_SUBMITTED':
      return 'doctor_order';
    case 'PRESCRIPTION_CREATED':
    default:
      return 'ai_report';
  }
}

export async function fetchNotifications(): Promise<Notification[]> {
  const res = await http.get<ApiNotification[]>('/notifications');

  return res.data.map((n) => ({
    id: n.id,
    type: mapType(n.type),
    message: n.message || n.title,
    timestamp: new Date(n.createdAt).toLocaleString(),
    isRead: n.status === 'READ',
    metadata: (() => {
      const parsed = metaSchema.safeParse(n.data ?? {});
      if (!parsed.success) return {};
      return {
        appointmentId: parsed.data.appointmentId ?? undefined,
        reportId: parsed.data.reportId,
        orderId: parsed.data.orderId ?? parsed.data.labOrderId,
        doctorName: parsed.data.doctorName,
      };
    })(),
  }));
}

export async function markAsRead(id: string): Promise<void> {
  await http.post(`/notifications/${id}/read`);
}
