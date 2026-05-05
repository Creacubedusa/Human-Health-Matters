import type { MedicalRecordSection } from '../types/profileOverview.types';
import {
  INITIAL_PROFILE_FORM,
  type ProfileForm,
} from '../types/profile.types';
import type {
  MedicationCategoryId,
  MedicationEditableFields,
} from '../types/medication.types';

const DEFAULT_MEDICATION_SOURCE: MedicationEditableFields = {
  medicationTypes: ['Insulin', 'Antidiabetics drugs'],
  currentMedications: ['Metformin', 'Prednisolone'],
};

const ANTIDIABETIC_LABELS: Record<string, string> = {
  metformin: 'Metformin',
  glipizide: 'Glipizide',
  sitagliptin: 'Sitagliptin',
  empagliflozin: 'Empagliflozin',
};

const CATEGORY_LABELS: Record<MedicationCategoryId, string> = {
  medicationTypes: 'Type',
  currentMedications: 'Current Medications',
};

const EMPTY_SUMMARY = 'No medication added yet';

function dedupeRows(values: string[]): string[] {
  const seen = new Set<string>();

  return values.reduce<string[]>((result, value) => {
    const trimmed = value.trim();
    if (!trimmed) return result;

    const normalizedKey = trimmed.toLocaleLowerCase();
    if (seen.has(normalizedKey)) return result;

    seen.add(normalizedKey);
    result.push(trimmed);
    return result;
  }, []);
}

export function seedMedicationFields(
  source: Partial<ProfileForm> | null | undefined,
): MedicationEditableFields {
  const medicationTypes = dedupeRows(source?.medicationTypes ?? []);
  const currentMedications = dedupeRows(source?.currentMedications ?? []);

  if (medicationTypes.length > 0 || currentMedications.length > 0) {
    return {
      medicationTypes,
      currentMedications,
    };
  }

  const seededTypes: string[] = [];
  const seededCurrent: string[] = [];
  const otherMedication = source?.otherMedication?.trim() ?? '';

  if (source?.insulinSubtype) {
    seededTypes.push('Insulin');
  }

  if (source?.antidiabeticSubtype) {
    seededTypes.push('Antidiabetics drugs');
    const selectedMedication = ANTIDIABETIC_LABELS[source.antidiabeticSubtype];
    if (selectedMedication) {
      seededCurrent.push(selectedMedication);
    }
  }

  if (otherMedication && seededTypes.length === 0) {
    seededTypes.push('Others');
  }

  if (otherMedication) {
    seededCurrent.push(otherMedication);
  }

  return {
    medicationTypes: dedupeRows(seededTypes),
    currentMedications: dedupeRows(seededCurrent),
  };
}

export function normalizeMedicationProfile(profile: ProfileForm): ProfileForm {
  return {
    ...profile,
    ...seedMedicationFields(profile),
  };
}

export function getEffectiveMedicationSource(
  source: ProfileForm | null | undefined,
): ProfileForm {
  const mergedProfile = {
    ...INITIAL_PROFILE_FORM,
    ...DEFAULT_MEDICATION_SOURCE,
    ...(source ?? {}),
  };

  return {
    ...mergedProfile,
    ...seedMedicationFields(mergedProfile),
  };
}

export function getMedicationCategorySummary(
  category: MedicationCategoryId,
  profile: ProfileForm | null | undefined,
): string {
  const source = getEffectiveMedicationSource(profile);
  const values = dedupeRows(source[category]);

  return values.length > 0 ? values.join(', ') : EMPTY_SUMMARY;
}

export function buildMedicationRecord(
  profile: ProfileForm | null | undefined,
  baseRecord?: MedicalRecordSection,
): MedicalRecordSection {
  const typeSummary = getMedicationCategorySummary('medicationTypes', profile);
  const currentSummary = getMedicationCategorySummary('currentMedications', profile);

  const summaryParts = [typeSummary, currentSummary]
    .filter((summary) => summary !== EMPTY_SUMMARY);

  const details = ([
    'medicationTypes',
    'currentMedications',
  ] as MedicationCategoryId[])
    .map((category) => {
      const summary = getMedicationCategorySummary(category, profile);
      if (summary === EMPTY_SUMMARY) return null;
      return `${CATEGORY_LABELS[category]}: ${summary}`;
    })
    .filter((detail): detail is string => detail != null);

  return {
    id: 'medication',
    title: baseRecord?.title ?? 'Medication',
    summary: summaryParts.length > 0 ? summaryParts.join(' • ') : EMPTY_SUMMARY,
    details,
  };
}

export function syncMedicationMedicalRecord(
  records: MedicalRecordSection[],
  profile: ProfileForm | null | undefined,
): MedicalRecordSection[] {
  return records.map((record) => (
    record.id === 'medication'
      ? buildMedicationRecord(profile, record)
      : record
  ));
}
