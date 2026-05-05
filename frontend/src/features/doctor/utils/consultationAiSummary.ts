import type { DoctorPatientProfile } from '../types/doctor.types';

export type DoctorConsultationSymptomSeverity = 'high' | 'moderate' | 'low';

export interface DoctorConsultationRecentSymptom {
  label: string;
  severity: DoctorConsultationSymptomSeverity;
}

export interface DoctorConsultationAISummary {
  patientName: string;
  gender: string;
  height: string;
  weight: string;
  age: string;
  chiefComplaint: string;
  aiSymptomsSummary: string;
  proposedTest: string;
  suggestedFirstQuestion: string;
  suggestedQuestions: string[];
  recentSymptoms: DoctorConsultationRecentSymptom[];
  medications: string[];
  allergies: string[];
}

function sentenceCase(value: string) {
  if (!value.trim()) return value;
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function joinSymptoms(symptoms: string[]) {
  if (symptoms.length === 0) return '';
  if (symptoms.length === 1) return symptoms[0];
  if (symptoms.length === 2) return `${symptoms[0]} and ${symptoms[1]}`;
  return `${symptoms.slice(0, -1).join(', ')}, and ${symptoms[symptoms.length - 1]}`;
}

function normalizeSymptom(symptom: string) {
  return symptom.replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function buildChiefComplaint(patient: DoctorPatientProfile) {
  const topSymptoms = patient.symptoms.slice(0, 3);
  if (topSymptoms.length > 0) {
    return sentenceCase(`Patient reports ${joinSymptoms(topSymptoms)}.`);
  }
  return patient.aiSummary.summary;
}

function buildProposedTest(patient: DoctorPatientProfile) {
  const symptomsText = patient.symptoms.join(' ').toLowerCase();

  if (patient.medicalRecords.orders[0]?.testName) {
    return patient.medicalRecords.orders[0].testName;
  }

  if (symptomsText.includes('chest') || symptomsText.includes('cardiac') || symptomsText.includes('arm pain')) {
    return 'ECG, troponin panel, and urgent blood pressure monitoring';
  }

  if (symptomsText.includes('diabetes') || symptomsText.includes('thirst') || symptomsText.includes('urination')) {
    return 'Fasting blood glucose, HbA1c, and urinalysis';
  }

  if (symptomsText.includes('abdominal') || symptomsText.includes('nausea')) {
    return 'Abdominal ultrasound, stool tests, and full blood count';
  }

  if (symptomsText.includes('back pain') || symptomsText.includes('mobility')) {
    return 'Lumbar spine assessment and musculoskeletal imaging if pain persists';
  }

  if (symptomsText.includes('headache') || symptomsText.includes('sleep') || symptomsText.includes('stress')) {
    return 'Blood pressure check, neurological screening, and stress evaluation';
  }

  return 'Full clinical assessment with targeted lab work based on symptom progression';
}

function buildSuggestedFirstQuestion(patient: DoctorPatientProfile) {
  const symptomsText = patient.symptoms.join(' ').toLowerCase();

  if (symptomsText.includes('chest') || symptomsText.includes('arm pain')) {
    return 'When did the chest pain start, and does it spread anywhere else right now?';
  }

  if (symptomsText.includes('diabetes') || symptomsText.includes('thirst') || symptomsText.includes('urination')) {
    return 'How long have you been having the thirst and urination changes, and have they been getting worse?';
  }

  if (symptomsText.includes('abdominal') || symptomsText.includes('nausea')) {
    return 'Can you point to where the abdominal pain is strongest and tell me what makes it worse?';
  }

  if (symptomsText.includes('back pain') || symptomsText.includes('mobility')) {
    return 'What movements or times of day make the back pain and stiffness feel worst?';
  }

  if (symptomsText.includes('headache') || symptomsText.includes('stress') || symptomsText.includes('sleep')) {
    return 'What has your sleep been like recently, and when do the headaches usually begin?';
  }

  return 'Can you walk me through your main symptoms and how they have changed since they started?';
}

function buildSuggestedQuestions(
  patient: DoctorPatientProfile,
  firstQuestion: string,
) {
  const symptomsText = patient.symptoms.join(' ').toLowerCase();

  if (symptomsText.includes('chest') || symptomsText.includes('arm pain')) {
    return [
      firstQuestion,
      'Have you noticed sweating, dizziness, or palpitations with these symptoms?',
      'What were you doing when the discomfort first began today?',
    ];
  }

  if (symptomsText.includes('diabetes') || symptomsText.includes('thirst') || symptomsText.includes('urination')) {
    return [
      firstQuestion,
      'Have you checked your blood sugar recently, and what was the reading?',
      'Have you had any recent changes in appetite, weight, or vision?',
    ];
  }

  if (symptomsText.includes('abdominal') || symptomsText.includes('nausea')) {
    return [
      firstQuestion,
      'Have you had vomiting, diarrhea, or fever with the abdominal pain?',
      'Did the symptoms start before or after eating or traveling?',
    ];
  }

  if (symptomsText.includes('back pain') || symptomsText.includes('mobility')) {
    return [
      firstQuestion,
      'Does the pain travel down either leg or cause numbness?',
      'What activities or posture make the pain feel better or worse?',
    ];
  }

  if (symptomsText.includes('headache') || symptomsText.includes('stress') || symptomsText.includes('sleep')) {
    return [
      firstQuestion,
      'How often are the headaches happening during the week?',
      'Have you noticed any triggers such as screen time, stress, or poor sleep?',
    ];
  }

  return [
    firstQuestion,
    'What changes have you noticed since the symptoms first began?',
    'Is there anything that makes the symptoms better or worse?',
  ];
}

function severityFromPatient(symptom: string, patient: DoctorPatientProfile): DoctorConsultationSymptomSeverity {
  const normalized = symptom.toLowerCase();

  if (
    patient.severity === 'emergency' ||
    normalized.includes('chest') ||
    normalized.includes('breath') ||
    normalized.includes('arm pain') ||
    normalized.includes('dizziness')
  ) {
    return 'high';
  }

  if (
    patient.severity === 'moderate' ||
    normalized.includes('pain') ||
    normalized.includes('nausea') ||
    normalized.includes('blurry') ||
    normalized.includes('stiffness')
  ) {
    return 'moderate';
  }

  return 'low';
}

function buildRecentSymptoms(patient: DoctorPatientProfile): DoctorConsultationRecentSymptom[] {
  return patient.symptoms.slice(0, 3).map((symptom) => ({
    label: normalizeSymptom(symptom),
    severity: severityFromPatient(symptom, patient),
  }));
}

export function buildDoctorConsultationAISummary(
  patient: DoctorPatientProfile | null,
): DoctorConsultationAISummary | null {
  if (!patient) return null;

  const suggestedFirstQuestion = buildSuggestedFirstQuestion(patient);

  return {
    patientName: patient.name,
    gender: patient.gender,
    height: patient.height,
    weight: patient.weight,
    age: `${patient.age} years`,
    chiefComplaint: buildChiefComplaint(patient),
    aiSymptomsSummary: patient.aiSummary.summary,
    proposedTest: buildProposedTest(patient),
    suggestedFirstQuestion,
    suggestedQuestions: buildSuggestedQuestions(patient, suggestedFirstQuestion),
    recentSymptoms: buildRecentSymptoms(patient),
    medications:
      patient.medicalRecords.medicationCategories.currentMedications.length > 0
        ? patient.medicalRecords.medicationCategories.currentMedications
        : patient.medicalRecords.medication,
    allergies: patient.medicalRecords.patientHistoryCategories.allergies,
  };
}
