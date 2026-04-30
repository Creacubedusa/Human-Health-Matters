export type NotificationType =
  | 'doctor_joined'
  | 'ai_report'
  | 'appointment'
  | 'doctor_order';

export type NotificationFilter = 'all' | 'read' | 'unread';

export interface NotificationMetadata {
  doctorName?: string;
  reportId?: string;
  appointmentId?: string;
  orderId?: string;
}

export interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  timestamp: string;
  isRead: boolean;
  metadata?: NotificationMetadata;
}
