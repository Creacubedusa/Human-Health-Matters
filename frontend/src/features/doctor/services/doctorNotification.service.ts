import type { DoctorNotification } from '../types/doctorNotification.types';

const MOCK_DOCTOR_NOTIFICATIONS: DoctorNotification[] = [
  {
    id: 'doctor-notification-1',
    type: 'consultation',
    message: 'Your 10:00 AM consultation with Angela Dairo is ready to begin.',
    timestamp: 'Today, 9:45 AM',
    isRead: false,
    metadata: {
      appointmentId: 'appointment-angela-1',
      patientId: '1',
    },
  },
  {
    id: 'doctor-notification-2',
    type: 'patient_assigned',
    message: 'David Hassan has been added to your patient queue for follow-up review.',
    timestamp: 'Today, 8:20 AM',
    isRead: false,
    metadata: {
      patientId: '2',
    },
  },
  {
    id: 'doctor-notification-3',
    type: 'ai_summary',
    message: 'A new AI pre-visit summary is available for Halima Yusuf.',
    timestamp: 'Yesterday, 6:10 PM',
    isRead: true,
    metadata: {
      patientId: '3',
      reportId: 'ai-summary-halima',
    },
  },
  {
    id: 'doctor-notification-4',
    type: 'test_result',
    message: 'New test results were uploaded to Angela Dairo’s medical record.',
    timestamp: 'Yesterday, 2:05 PM',
    isRead: true,
    metadata: {
      patientId: '1',
    },
  },
];

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function fetchDoctorNotifications(): Promise<DoctorNotification[]> {
  await delay(250);
  return MOCK_DOCTOR_NOTIFICATIONS;
}

export async function markDoctorNotificationRead(_id: string): Promise<void> {
  await delay(120);
}
