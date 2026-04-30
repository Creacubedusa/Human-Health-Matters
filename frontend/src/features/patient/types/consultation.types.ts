export type CallStatus = 'connecting' | 'active' | 'ended';
export type AudioRoute = 'speaker' | 'earpiece' | 'bluetooth' | 'audio';
export type Language = 'en' | 'es' | 'fr' | 'ar' | 'tr';
export type TranscriptionStatus = 'idle' | 'requesting' | 'active' | 'error';
export type ActivePanel = 'none' | 'doctorChat' | 'aiChat' | 'transcription';

export interface ChatMessage {
  id: string;
  sender: 'patient' | 'doctor' | 'ai';
  text: string;
  timestamp: string;
}

export interface TranscriptEntry {
  id: string;
  speaker: string;
  originalText: string;
  translatedText: string;
  timestamp: string;
}

export interface MockDoctor {
  id: string;
  name: string;
  specialty: string;
  avatarInitials: string;
}

export interface ConsultationSession {
  doctor: MockDoctor;
  aiNoteActive: boolean;
}

export interface ReviewPayload {
  sessionId: string;
  rating: number;
  reviewText: string;
  wouldRecommend: boolean;
}
