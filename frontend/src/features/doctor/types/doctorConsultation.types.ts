export type DoctorCallStatus = 'connecting' | 'active' | 'ended';
export type DoctorAudioRoute = 'speaker' | 'earpiece' | 'bluetooth' | 'audio';
export type DoctorLanguage = 'en' | 'es' | 'fr' | 'ar' | 'tr';
export type DoctorTranscriptionStatus = 'idle' | 'requesting' | 'active' | 'error';
export type DoctorConsultationPanel = 'none' | 'patientChat' | 'soapAI';
export type DoctorDiagnosisPriority = 'primary' | 'secondary';

export interface DoctorChatMessage {
  id: string;
  sender: 'doctor' | 'patient' | 'ai';
  text: string;
  timestamp: string;
}

export interface SoapNote {
  subjective: string;
  objective: string;
  assessment: string;
  plan: string;
}

export interface DoctorTranscriptEntry {
  id: string;
  speaker: string;
  originalText: string;
  translatedText: string;
  timestamp: string;
}

export interface DoctorPatientSession {
  patientName: string;
  patientInitials: string;
  appointmentId: string;
}

export interface DoctorPostSessionDiagnosisDraft {
  id: string;
  name: string;
  icd10Code: string;
  priority: DoctorDiagnosisPriority;
}

export interface DoctorPostSessionRecommendedTestDraft {
  id: string;
  name: string;
}

export interface DoctorPostSessionPrescriptionDraft {
  id: string;
  medication: string;
  brandName: string;
  dose: string;
  frequency: string;
  duration: string;
  route: string;
  refillsLeft: string;
  notes: string;
}

export interface DoctorPostSessionCarePlanDraft {
  consultationId: string;
  appointmentId: string;
  patientId: string;
  patientName: string;
  patientInitials: string;
  patientGender: string;
  sessionType: string;
  consultationType: string;
  duration: string;
  consultationDate: string;
  isAiGenerated: boolean;
  soap: SoapNote;
  diagnoses: DoctorPostSessionDiagnosisDraft[];
  recommendedTests: DoctorPostSessionRecommendedTestDraft[];
  prescriptions: DoctorPostSessionPrescriptionDraft[];
}
