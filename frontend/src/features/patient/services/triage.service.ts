import type {
  TriageMessage,
  TriageResult,
  TriageSeverity,
  TriageHistoryItem,
  NextStep,
} from '../types/triage.types';
import type { DoctorMatchContext } from '../types/appointmentBooking.types';

const EMERGENCY_KEYWORDS = ['chest', 'arm', 'dizzy', 'sweating', 'breath', 'heart', 'fainting', 'faint', 'pressure', 'squeeze', 'squeezing', 'heavy', 'heaviness'];
const MODERATE_KEYWORDS = ['fever', 'cough', 'headache', 'nausea', 'vomiting', 'moderate', 'temperature', 'sore throat', 'flu'];

const AI_TURNS: { content: string; options?: Array<{ label: string; value: string }> }[] = [
  {
    content: "Hi there! I'm here to help you figure out what's going on. Can you tell me what you're feeling right now?",
  },
  {
    content: "I'm sorry to hear that. How long have you been feeling this way? And would you describe the discomfort as sharp, dull, or more like pressure or squeezing?",
  },
  {
    content: "Thank you for sharing that. Is the discomfort staying in one place, or does it seem to spread anywhere?",
    options: [
      { label: 'Left arm', value: 'left_arm' },
      { label: 'Right arm', value: 'right_arm' },
      { label: 'Jaw', value: 'jaw' },
      { label: 'Back', value: 'back' },
    ],
  },
  {
    content: "Are you experiencing any of the following alongside the discomfort? Select all that apply.",
    options: [
      { label: 'Sweating', value: 'sweating' },
      { label: 'Shortness of breath', value: 'breath' },
      { label: 'Dizziness', value: 'dizziness' },
      { label: 'Fainting', value: 'fainting' },
    ],
  },
];

function uid(): string {
  return Math.random().toString(36).slice(2, 10);
}

export function getMockAiResponse(userMessages: string[]): TriageMessage {
  const index = Math.min(userMessages.length, AI_TURNS.length - 1);
  const isLast = userMessages.length >= AI_TURNS.length;

  if (isLast) {
    const severity = computeSeverityFromTexts(userMessages);
    const verdicts: Record<TriageSeverity, string> = {
      emergency:
        "The combination of chest pressure, left arm heaviness, sweating, and shortness of breath are serious symptoms. I'm flagging this as an emergency.",
      urgent:
        "Your symptoms suggest an urgent condition. Please seek medical attention promptly.",
      moderate:
        "Based on what you've described, your symptoms may need medical attention within the next 24 hours.",
      low: "Your symptoms appear mild. Rest and monitor how you feel. If things worsen, please reach out again.",
    };
    return {
      id: uid(),
      role: 'ai',
      content: verdicts[severity],
      timestamp: Date.now(),
      showViewResult: true,
    };
  }

  const turn = AI_TURNS[index];
  return {
    id: uid(),
    role: 'ai',
    content: turn.content,
    timestamp: Date.now(),
    options: turn.options,
  };
}

function computeSeverityFromTexts(texts: string[]): TriageSeverity {
  const combined = texts.join(' ').toLowerCase();
  for (const kw of EMERGENCY_KEYWORDS) {
    if (combined.includes(kw)) return 'emergency';
  }
  for (const kw of MODERATE_KEYWORDS) {
    if (combined.includes(kw)) return 'moderate';
  }
  return 'low';
}

function unique(values: string[]) {
  return Array.from(new Set(values));
}

function deriveDoctorMatchContext(userMessages: string[], severity: TriageSeverity): DoctorMatchContext {
  const combined = userMessages.join(' ').toLowerCase();
  const symptoms: string[] = [];
  const history: string[] = [];

  if (combined.includes('chest')) symptoms.push('chest tightness');
  if (combined.includes('fatigue') || combined.includes('tired')) symptoms.push('fatigue');
  if (combined.includes('breath')) symptoms.push('shortness of breath');
  if (combined.includes('dizzy')) symptoms.push('dizziness');
  if (combined.includes('pressure') || combined.includes('squeeze')) symptoms.push('chest pressure');

  if (combined.includes('hypertension') || combined.includes('blood pressure')) history.push('hypertension');
  if (combined.includes('heart')) history.push('cardiac history');

  return {
    symptoms: unique(symptoms).length > 0 ? unique(symptoms) : ['chest tightness', 'fatigue'],
    history: unique(history).length > 0 ? unique(history) : ['hypertension'],
    urgency: severity,
    coverageStatus: 'eligible',
    donorFund: 'available',
  };
}

const RESULT_DATA: Record<TriageSeverity, { summary: string; nextSteps: NextStep[] }> = {
  emergency: {
    summary:
      'Based on your symptoms—chest pressure, pain spreading to your arm, dizziness, and sweating—this may be a serious heart-related condition. These symptoms are commonly associated with a possible heart attack and require immediate medical attention.',
    nextSteps: [
      { title: 'Call someone into the room', description: 'You need someone with you immediately.' },
      { title: 'Seek emergency care right away', description: 'Call your local emergency number immediately or book a consultation right away.' },
      { title: 'Sit or lie down — do not exert yourself', description: 'Stay calm and still. Loosen tight clothing. Keep this app open.' },
    ],
  },
  urgent: {
    summary:
      'Your symptoms suggest an urgent condition that requires prompt medical evaluation. Please do not delay seeking care.',
    nextSteps: [
      { title: 'Contact a doctor now', description: 'Book an urgent consultation or visit an urgent care centre.' },
      { title: 'Monitor your symptoms', description: 'Track any changes, especially if symptoms worsen rapidly.' },
      { title: 'Avoid strenuous activity', description: 'Rest and stay calm until you receive medical guidance.' },
    ],
  },
  moderate: {
    summary:
      'You reported symptoms such as persistent cough, moderate fever, and chest discomfort. These symptoms suggest a condition that may require medical attention. While this is not immediately life-threatening, it is important to have it evaluated to prevent possible complications.',
    nextSteps: [
      { title: 'Schedule a consultation', description: 'Schedule a consultation with a healthcare provider within the next 24 hours.' },
      { title: 'Be Vigilant', description: 'Keep track of any changes, especially worsening symptoms.' },
      { title: 'Call Emergency', description: 'Seek immediate medical care if you experience severe chest pain, difficulty breathing, or a rapid worsening of your condition.' },
    ],
  },
  low: {
    summary:
      'Based on your symptoms, your condition appears mild. With proper rest and care, you should recover without intervention.',
    nextSteps: [
      { title: 'Rest and Hydrate', description: 'Get adequate rest and stay well hydrated.' },
      { title: 'Over-the-counter Medication', description: 'You may use over-the-counter medication for relief if needed.' },
      { title: 'Seek medical intervention', description: 'Monitor your symptoms over the next 24–48 hours. If symptoms persist, seek medical intervention.' },
    ],
  },
};

export function computeTriageResult(userMessages: string[], sessionId: string): TriageResult {
  const severity = computeSeverityFromTexts(userMessages);
  return {
    severity,
    summary: RESULT_DATA[severity].summary,
    nextSteps: RESULT_DATA[severity].nextSteps,
    sessionId,
    matchingContext: deriveDoctorMatchContext(userMessages, severity),
  };
}

export async function fetchTriageHistory(): Promise<TriageHistoryItem[]> {
  await new Promise((r) => setTimeout(r, 600));
  return [
    { id: 'h1', title: 'Chest Pressure', description: 'Based on this symptoms', date: 'Dec 12, 2024', severity: 'emergency' },
    { id: 'h2', title: 'Cough & Fever', description: 'Based on this symptoms', date: 'Nov 28, 2024', severity: 'moderate' },
    { id: 'h3', title: 'Mild Headache', description: 'Based on this symptoms', date: 'Nov 10, 2024', severity: 'low' },
    { id: 'h4', title: 'Chest Pressure', description: 'Based on this symptoms', date: 'Oct 5, 2024', severity: 'emergency' },
    { id: 'h5', title: 'Sore Throat', description: 'Based on this symptoms', date: 'Sep 18, 2024', severity: 'low' },
  ];
}

export async function saveToWishlist(_result: TriageResult): Promise<void> {
  await new Promise((r) => setTimeout(r, 500));
}
