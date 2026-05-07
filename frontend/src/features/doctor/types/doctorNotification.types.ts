export type DoctorNotificationType =
  | 'consultation'
  | 'patient_assigned'
  | 'ai_summary'
  | 'test_result';

export type DoctorNotificationFilter = 'all' | 'read' | 'unread';

export interface DoctorNotificationMetadata {
  patientId?: string;
  appointmentId?: string;
  reportId?: string;
}

export interface DoctorNotification {
  id: string;
  type: DoctorNotificationType;
  message: string;
  timestamp: string;
  isRead: boolean;
  metadata?: DoctorNotificationMetadata;
}
