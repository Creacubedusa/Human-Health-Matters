import type { MedicalRecordSection } from '../types/profileOverview.types';
import {
  INITIAL_PROFILE_FORM,
  type ProfileForm,
} from '../types/profile.types';
import type {
  PatientHistoryCategoryId,
  PatientHistoryEditableFields,
} from '../types/patientHistory.types';

const DEFAULT_PATIENT_HISTORY_SOURCE: PatientHistoryEditableFields = {
  familyHistoryDiabetes: 'yes',
  chronicDiseases: ['Hypertension', 'Diabetes'],
  generalFamilyHistory: ['Heart disease'],
  surgeries: ['Cardiac surgery', 'Neurological surgery'],
  allergies: ['Medication allergies'],
};

const CATEGORY_LABELS: Record<PatientHistoryCategoryId, string> = {
  chronicDiseases: 'Chronic diseases',
  familyHistoryDiabetes: 'Family diabetes history',
  generalFamilyHistory: 'General family history',
  surgeries: 'Operation',
  allergies: 'Allergies',
};

const EMPTY_SUMMARY = 'No patient history added yet';

export function getEffectivePatientHistorySource(
  source: ProfileForm | null | undefined,
): ProfileForm {
  return {
    ...INITIAL_PROFILE_FORM,
    ...DEFAULT_PATIENT_HISTORY_SOURCE,
    ...(source ?? {}),
  };
}

export function getPatientHistorySummary(
  category: PatientHistoryCategoryId,
  profile: ProfileForm | null | undefined,
): string {
  const source = getEffectivePatientHistorySource(profile);

  if (category === 'familyHistoryDiabetes') {
    if (source.familyHistoryDiabetes === 'yes') return 'Yes';
    if (source.familyHistoryDiabetes === 'no') return 'No';
    if (source.familyHistoryDiabetes === 'unknown') return 'Unknown';
    return EMPTY_SUMMARY;
  }

  const values = source[category]
    .map((value) => value.trim())
    .filter(Boolean);

  return values.length > 0 ? values.join(', ') : EMPTY_SUMMARY;
}

export function buildPatientHistoryRecord(
  profile: ProfileForm | null | undefined,
  baseRecord?: MedicalRecordSection,
): MedicalRecordSection {
  const summaries = [
    getPatientHistorySummary('chronicDiseases', profile),
    getPatientHistorySummary('familyHistoryDiabetes', profile),
    getPatientHistorySummary('generalFamilyHistory', profile),
    getPatientHistorySummary('surgeries', profile),
    getPatientHistorySummary('allergies', profile),
  ].filter((summary) => summary !== EMPTY_SUMMARY);

  const details = ([
    'chronicDiseases',
    'familyHistoryDiabetes',
    'generalFamilyHistory',
    'surgeries',
    'allergies',
  ] as PatientHistoryCategoryId[])
    .map((category) => {
      const summary = getPatientHistorySummary(category, profile);
      if (summary === EMPTY_SUMMARY) return null;
      return `${CATEGORY_LABELS[category]}: ${summary}`;
    })
    .filter((detail): detail is string => detail != null);

  const summary =
    summaries.length > 0
      ? summaries.slice(0, 2).join(' • ')
      : EMPTY_SUMMARY;

  return {
    id: 'patient-history',
    title: baseRecord?.title ?? 'Patient history',
    summary,
    details,
  };
}

export function syncPatientHistoryMedicalRecord(
  records: MedicalRecordSection[],
  profile: ProfileForm | null | undefined,
): MedicalRecordSection[] {
  return records.map((record) => (
    record.id === 'patient-history'
      ? buildPatientHistoryRecord(profile, record)
      : record
  ));
}
