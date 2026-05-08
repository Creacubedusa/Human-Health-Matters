import { z } from 'zod';
import { http } from '@shared/api/http';
import type {
  DoctorNotification,
  DoctorNotificationType,
} from '../types/doctorNotification.types';

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
    patientId: z.string().optional(),
    appointmentId: z.string().nullable().optional(),
    reportId: z.string().optional(),
    reviewId: z.string().optional(),
    labOrderId: z.string().optional(),
    instant: z.boolean().optional(),
  })
  .passthrough();

function mapType(apiType: string): DoctorNotificationType {
  switch (apiType) {
    case 'APPOINTMENT_BOOKED':
    case 'APPOINTMENT_RESCHEDULED':
    case 'APPOINTMENT_CANCELLED':
      return 'consultation';
    case 'LAB_ORDER_SUBMITTED':
      return 'patient_assigned';
    default:
      return 'patient_assigned';
  }
}

function formatTimestamp(iso: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleString();
}

export async function fetchDoctorNotifications(): Promise<DoctorNotification[]> {
  const res = await http.get<ApiNotification[]>('/notifications');
  return res.data.map((n) => {
    const parsedMeta = metaSchema.safeParse(n.data ?? {});
    const metadata = parsedMeta.success ? parsedMeta.data : {};
    return {
      id: n.id,
      type: mapType(n.type),
      message: n.message || n.title,
      timestamp: formatTimestamp(n.createdAt),
      isRead: n.status === 'READ',
      metadata: {
        patientId: metadata.patientId,
        appointmentId: metadata.appointmentId ?? undefined,
        reportId: metadata.reportId,
      },
    };
  });
}

export async function markDoctorNotificationRead(id: string): Promise<void> {
  await http.post(`/notifications/${id}/read`);
}
