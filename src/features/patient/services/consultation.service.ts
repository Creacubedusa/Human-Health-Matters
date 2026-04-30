import type { ConsultationSession, ReviewPayload } from '../types/consultation.types';

const MOCK_SESSION: ConsultationSession = {
  doctor: {
    id: 'dr-paul-grant',
    name: 'Dr. Paul Grant',
    specialty: 'General Practitioner',
    avatarInitials: 'PG',
  },
  aiNoteActive: true,
};

const AI_REPLIES = [
  'Based on your symptoms, it may be related to inflammation. I recommend discussing this with your doctor.',
  'That is a great question. The medication your doctor mentioned is commonly used for this condition.',
  'Your blood pressure reading is within a normal range. Continue monitoring it daily.',
  'Staying hydrated and getting adequate rest are important for your recovery.',
  'I would recommend keeping a symptom journal between appointments for better tracking.',
];

let aiReplyIndex = 0;

export async function fetchConsultationSession(): Promise<ConsultationSession> {
  await new Promise<void>((r) => setTimeout(r, 1500));
  return MOCK_SESSION;
}

export async function sendAIMessage(text: string): Promise<string> {
  await new Promise<void>((r) => setTimeout(r, 1200));
  const reply = AI_REPLIES[aiReplyIndex % AI_REPLIES.length];
  aiReplyIndex += 1;
  return reply;
}

export async function submitReview(_payload: ReviewPayload): Promise<void> {
  await new Promise<void>((r) => setTimeout(r, 800));
}
