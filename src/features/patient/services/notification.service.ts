import type { Notification } from '../types/notification.types';

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: 'n1',
    type: 'doctor_joined',
    message: 'Dr Paul Grant has joined the consultation session. Please join now!',
    timestamp: 'Today at 9:42 AM',
    isRead: false,
    metadata: { doctorName: 'Dr Paul Grant', sessionId: 'session-001' },
  },
  {
    id: 'n2',
    type: 'ai_report',
    message: 'Nura AI report for Angela Dairo is ready',
    timestamp: 'Today at 9:30 AM',
    isRead: false,
    metadata: { reportId: 'report-001' },
  },
  {
    id: 'n3',
    type: 'appointment',
    message:
      'You have successfully booked an appointment with Dr Paul Grant on Dec 12 at 9:00 AM',
    timestamp: 'Yesterday at 3:15 PM',
    isRead: false,
    metadata: { doctorName: 'Dr Paul Grant', appointmentId: 'appt-001' },
  },
  {
    id: 'n4',
    type: 'doctor_order',
    message: 'Dr Paul Grant has created an order for you',
    timestamp: 'Yesterday at 11:00 AM',
    isRead: true,
    metadata: { doctorName: 'Dr Paul Grant', orderId: 'order-001' },
  },
];

export async function fetchNotifications(): Promise<Notification[]> {
  await new Promise((resolve) => setTimeout(resolve, 800));
  return [...MOCK_NOTIFICATIONS];
}

export async function markAsRead(_id: string): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 100));
}
