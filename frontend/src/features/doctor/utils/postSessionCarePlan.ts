import type { CarePlan, Diagnosis, Prescription, RecommendedTest } from '@features/patient/types/carePlan.types';
import type { DoctorPatientProfile, DoctorPrescriptionDraft } from '../types/doctor.types';
import type {
  DoctorDiagnosisPriority,
  DoctorPostSessionCarePlanDraft,
  DoctorPostSessionDiagnosisDraft,
  DoctorPostSessionPrescriptionDraft,
  DoctorPostSessionRecommendedTestDraft,
  DoctorTranscriptEntry,
  SoapNote,
} from '../types/doctorConsultation.types';
import { buildDoctorConsultationAISummary } from './consultationAiSummary';

function makeId(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
}

function toSentenceCase(value: string) {
  if (!value.trim()) return value;
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function splitIntoItems(value: string) {
  return value
    .split(/\n|;|,(?=\s*[A-Z0-9])/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function buildManualSoap(): SoapNote {
  return {
    subjective: '',
    objective: '',
    assessment: '',
    plan: '',
  };
}

function buildAiSoap(patient: DoctorPatientProfile, transcript: DoctorTranscriptEntry[]): SoapNote {
  const summary = buildDoctorConsultationAISummary(patient);
  const doctorQuestions = transcript
    .filter((entry) => entry.speaker.toLowerCase().includes('doctor'))
    .slice(0, 2)
    .map((entry) => entry.originalText.trim())
    .filter(Boolean);
  const patientResponses = transcript
    .filter((entry) => entry.speaker.toLowerCase().includes(patient.name.toLowerCase()) || entry.speaker.toLowerCase().includes('patient'))
    .slice(0, 2)
    .map((entry) => entry.originalText.trim())
    .filter(Boolean);

  const subjectiveParts = [
    summary?.chiefComplaint,
    patientResponses.length > 0 ? `During the consultation, the patient added: ${patientResponses.join(' ')}` : '',
  ].filter(Boolean);

  const objectiveParts = [
    doctorQuestions.length > 0 ? `Doctor explored: ${doctorQuestions.join(' ')}` : '',
    summary ? `AI symptom summary: ${summary.aiSymptomsSummary}` : '',
  ].filter(Boolean);

  const assessmentItems = summary
    ? [
        `Likely active issue related to ${summary.chiefComplaint.replace(/^Patient reports\s*/i, '').replace(/\.$/, '')}`,
        `Clinical review should confirm whether ${summary.proposedTest.toLowerCase()} is indicated`,
      ]
    : ['Clinical assessment pending'];

  const planItems = summary
    ? [
        `Review findings and consider ${summary.proposedTest}`,
        `Start consultation plan based on symptom severity and patient response`,
        summary.suggestedFirstQuestion,
      ]
    : ['Document follow-up plan after review'];

  return {
    subjective: subjectiveParts.join(' '),
    objective: objectiveParts.join(' '),
    assessment: assessmentItems.join('\n'),
    plan: planItems.join('\n'),
  };
}

function buildDiagnoses(patient: DoctorPatientProfile, isAiGenerated: boolean): DoctorPostSessionDiagnosisDraft[] {
  if (!isAiGenerated) {
    return [
      { id: makeId('diagnosis'), name: '', icd10Code: '', priority: 'primary' },
    ];
  }

  const symptoms = patient.symptoms.join(' ').toLowerCase();
  const diagnoses: Array<{ name: string; icd10Code: string; priority: DoctorDiagnosisPriority }> = [];

  if (symptoms.includes('chest') || symptoms.includes('cardiac')) {
    diagnoses.push(
      { name: 'Chest pain syndrome', icd10Code: 'R07.9', priority: 'primary' },
      { name: 'Dizziness', icd10Code: 'R42', priority: 'secondary' },
    );
  } else if (symptoms.includes('diabetes') || symptoms.includes('thirst') || symptoms.includes('urination')) {
    diagnoses.push(
      { name: 'Type 2 diabetes mellitus', icd10Code: 'E11.9', priority: 'primary' },
      { name: 'Polyuria', icd10Code: 'R35.89', priority: 'secondary' },
    );
  } else if (symptoms.includes('abdominal') || symptoms.includes('nausea')) {
    diagnoses.push(
      { name: 'Abdominal pain', icd10Code: 'R10.9', priority: 'primary' },
      { name: 'Nausea', icd10Code: 'R11.0', priority: 'secondary' },
    );
  } else if (symptoms.includes('back pain')) {
    diagnoses.push(
      { name: 'Low back pain', icd10Code: 'M54.50', priority: 'primary' },
      { name: 'Reduced mobility', icd10Code: 'Z74.09', priority: 'secondary' },
    );
  } else {
    diagnoses.push(
      { name: toSentenceCase(patient.symptoms[0] ?? 'Clinical review required'), icd10Code: 'R69', priority: 'primary' },
    );
  }

  return diagnoses.map((diagnosis) => ({
    id: makeId('diagnosis'),
    ...diagnosis,
  }));
}

function buildRecommendedTests(patient: DoctorPatientProfile, isAiGenerated: boolean): DoctorPostSessionRecommendedTestDraft[] {
  if (!isAiGenerated) {
    return [{ id: makeId('test'), name: '' }];
  }

  const summary = buildDoctorConsultationAISummary(patient);
  const tests = splitIntoItems(summary?.proposedTest ?? '');
  const source = tests.length > 0 ? tests : patient.medicalRecords.orders.slice(0, 2).map((order) => order.testName);

  return (source.length > 0 ? source : ['Clinical review pending']).map((name) => ({
    id: makeId('test'),
    name,
  }));
}

function parsePrescriptionDetail(details: string[], label: string) {
  const match = details.find((detail) => detail.toLowerCase().startsWith(`${label.toLowerCase()}:`));
  return match ? match.split(':').slice(1).join(':').trim() : '';
}

function fromPrescriptionDraft(draft: DoctorPrescriptionDraft): DoctorPostSessionPrescriptionDraft {
  return {
    id: makeId('prescription'),
    medication: draft.medication,
    brandName: draft.brandName,
    dose: draft.dose,
    frequency: draft.frequency,
    duration: draft.duration,
    route: draft.route,
    refillsLeft: draft.refillsLeft,
    notes: draft.notes,
  };
}

function buildPrescriptions(patient: DoctorPatientProfile, isAiGenerated: boolean): DoctorPostSessionPrescriptionDraft[] {
  if (!isAiGenerated) {
    return [fromPrescriptionDraft({
      medication: '',
      brandName: '',
      dose: '',
      frequency: '',
      duration: '',
      route: '',
      refillsLeft: '',
      notes: '',
    })];
  }

  const source = patient.medicalRecords.prescriptions.slice(0, 2);
  if (source.length === 0) {
    return [fromPrescriptionDraft({
      medication: '',
      brandName: '',
      dose: '',
      frequency: '',
      duration: '',
      route: '',
      refillsLeft: '',
      notes: '',
    })];
  }

  return source.map((prescription) => ({
    id: makeId('prescription'),
    medication: prescription.medication,
    brandName: parsePrescriptionDetail(prescription.details, 'Brand name'),
    dose: parsePrescriptionDetail(prescription.details, 'Dose') || parsePrescriptionDetail(prescription.details, 'Dosage'),
    frequency: parsePrescriptionDetail(prescription.details, 'Frequency'),
    duration: parsePrescriptionDetail(prescription.details, 'Duration'),
    route: parsePrescriptionDetail(prescription.details, 'Route'),
    refillsLeft: String(prescription.refillsLeft),
    notes: parsePrescriptionDetail(prescription.details, 'Notes'),
  }));
}

export function buildPostSessionCarePlanDraft(
  patient: DoctorPatientProfile,
  appointmentId: string,
  transcript: DoctorTranscriptEntry[],
  duration: string,
  consultationDate: string,
  isAiGenerated: boolean,
): DoctorPostSessionCarePlanDraft {
  return {
    consultationId: appointmentId || patient.id,
    appointmentId: appointmentId || patient.id,
    patientId: patient.id,
    patientName: patient.name,
    patientInitials: patient.name
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join('') || 'P',
    patientGender: patient.gender,
    sessionType: 'Video',
    consultationType: 'Virtual',
    duration,
    consultationDate,
    isAiGenerated,
    soap: isAiGenerated ? buildAiSoap(patient, transcript) : buildManualSoap(),
    diagnoses: buildDiagnoses(patient, isAiGenerated),
    recommendedTests: buildRecommendedTests(patient, isAiGenerated),
    prescriptions: buildPrescriptions(patient, isAiGenerated),
  };
}

export function createPatientCarePlanFromDraft(
  draft: DoctorPostSessionCarePlanDraft,
  doctorName: string,
  specialty: string,
): CarePlan {
  const diagnoses: Diagnosis[] = draft.diagnoses
    .filter((item) => item.name.trim())
    .map((item) => ({
      id: item.id,
      name: item.name.trim(),
      icd10Code: item.icd10Code.trim(),
      priority: item.priority,
    }));

  const recommendedTests: RecommendedTest[] = draft.recommendedTests
    .filter((item) => item.name.trim())
    .map((item) => ({
      id: item.id,
      name: item.name.trim(),
    }));

  const prescriptions: Prescription[] = draft.prescriptions
    .filter((item) => item.medication.trim())
    .map((item) => ({
      id: item.id,
      medication: item.medication.trim(),
      details: [
        item.dose && `Dose: ${item.dose}`,
        item.brandName && `Brand name: ${item.brandName}`,
        item.frequency && `Frequency: ${item.frequency}`,
        item.duration && `Duration: ${item.duration}`,
        item.route && `Route: ${item.route}`,
        item.refillsLeft && `Refills left: ${item.refillsLeft}`,
        item.notes && `Notes: ${item.notes}`,
      ].filter(Boolean),
    }));

  return {
    id: `care-${Date.now()}`,
    status: 'active',
    consultationTitle: `${draft.patientName} Consultation Care Plan`,
    doctorName,
    doctorDisplayName: doctorName.replace(/^Doctor\s+/i, ''),
    specialty,
    consultationDate: draft.consultationDate,
    detailDate: draft.consultationDate,
    duration: draft.duration,
    sessionType: draft.sessionType,
    consultationType: draft.consultationType,
    avatarUri: '',
    soapNotes: {
      subjective: draft.soap.subjective,
      objective: draft.soap.objective,
      assessment: splitIntoItems(draft.soap.assessment),
      plan: splitIntoItems(draft.soap.plan),
    },
    diagnoses,
    recommendedTests,
    prescriptions,
  };
}
