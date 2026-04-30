import type { DoctorMatchContext } from './appointmentBooking.types';

export type TriageSeverity = 'emergency' | 'urgent' | 'moderate' | 'low';
export type MessageRole = 'ai' | 'user';
export type TriageSessionMode = 'guided' | 'blank';

export interface TurnOption {
  label: string;
  value: string;
}

export interface TriageMessage {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: number;
  options?: TurnOption[];
  showViewResult?: boolean;
}

export interface NextStep {
  title: string;
  description: string;
}

export interface TriageResult {
  severity: TriageSeverity;
  summary: string;
  nextSteps: NextStep[];
  sessionId: string;
  matchingContext: DoctorMatchContext;
}

export interface TriageSession {
  id: string;
  messages: TriageMessage[];
  result: TriageResult | null;
  startedAt: number;
  mode: TriageSessionMode;
}

export interface TriageHistoryItem {
  id: string;
  title: string;
  description: string;
  summary: string;
  date: string;
  severity: TriageSeverity | null;
}
