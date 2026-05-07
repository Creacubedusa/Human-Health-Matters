import type { DoctorPatientProfile } from '../types/doctor.types';
import type { DoctorAIHistoryItem, DoctorAIPatient } from '../types/doctorNuraAI.types';

function titleCase(value: string) {
  return value
    .split(' ')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

export function formatHistoryDate(date = new Date()) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
}

export function truncateText(value: string, maxLength = 72) {
  const trimmed = value.trim();
  if (trimmed.length <= maxLength) return trimmed;
  return `${trimmed.slice(0, maxLength - 1).trimEnd()}...`;
}

export function getPatientCondition(patient: Pick<DoctorPatientProfile, 'symptoms'>) {
  const [firstSymptom] = patient.symptoms;
  return firstSymptom ? titleCase(firstSymptom) : 'AI Summary';
}

function parseDateInput(value: string | undefined) {
  if (!value) return null;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

export function getLatestPatientActivityDate(patient: DoctorPatientProfile) {
  const candidates = [
    ...patient.medicalRecords.orders.map((item) => item.date),
    ...patient.medicalRecords.prescriptions.map((item) => item.date),
    ...patient.medicalRecords.reports.map((item) => item.date),
    ...patient.medicalRecords.tests.map((item) => item.date),
  ]
    .map(parseDateInput)
    .filter((value): value is Date => value != null)
    .sort((a, b) => b.getTime() - a.getTime());

  return candidates[0] ?? new Date();
}

export function buildNuraPatientFromProfile(patient: DoctorPatientProfile): DoctorAIPatient {
  return {
    id: patient.id,
    patientName: patient.name,
    condition: getPatientCondition(patient),
    urgency: patient.severity,
    timeSlot: patient.appointmentTime,
    aiSummary: patient.aiSummary.summary,
  };
}

interface BuildHistoryArgs {
  id: string;
  condition: string;
  snippet: string;
  summaryText: string;
  date?: string;
  patientId?: string;
  patientName?: string;
  sourceType?: DoctorAIHistoryItem['sourceType'];
}

export function buildHistoryItem({
  id,
  condition,
  snippet,
  summaryText,
  date = formatHistoryDate(),
  patientId,
  patientName,
  sourceType,
}: BuildHistoryArgs): DoctorAIHistoryItem {
  return {
    id,
    condition,
    snippet,
    date,
    summaryText,
    patientId,
    patientName,
    sourceType,
  };
}

export function buildPatientSummaryHistoryItem(
  patient: DoctorPatientProfile,
  args?: {
    id?: string;
    snippet?: string;
    summaryText?: string;
    date?: string;
    sourceType?: DoctorAIHistoryItem['sourceType'];
  },
): DoctorAIHistoryItem {
  return buildHistoryItem({
    id: args?.id ?? `patient-summary-${patient.id}`,
    condition: getPatientCondition(patient),
    snippet:
      args?.snippet ??
      truncateText(`AI summary for ${patient.name}: ${patient.aiSummary.summary}`),
    summaryText: args?.summaryText ?? patient.aiSummary.summary,
    date: args?.date ?? formatHistoryDate(getLatestPatientActivityDate(patient)),
    patientId: patient.id,
    patientName: patient.name,
    sourceType: args?.sourceType ?? 'summary',
  });
}
