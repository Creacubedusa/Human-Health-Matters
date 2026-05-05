export type DoctorNuraChatRole = 'ai' | 'user';

export type DoctorPatientUrgency = 'emergency' | 'moderate' | 'low';

export interface DoctorNuraMessage {
  id: string;
  role: DoctorNuraChatRole;
  content: string;
  timestamp: string;
  showViewResult?: boolean;
}

export interface DoctorAIPatient {
  id: string;
  condition: string;
  patientName: string;
  urgency: DoctorPatientUrgency;
  timeSlot: string;
  aiSummary: string;
}

export interface DoctorAIHistoryItem {
  id: string;
  condition: string;
  snippet: string;
  date: string;
  summaryText: string;
  patientId?: string;
  patientName?: string;
  sourceType?: 'summary' | 'patient-chat' | 'general-chat' | 'soap-note';
}

export type DoctorNuraChatMode = 'general' | 'patient-context';
