export type WeightUnit = 'kg' | 'lbs';
export type HeightUnit = 'cm' | 'ft_in';
export type Gender = 'male' | 'female' | 'other';

// Matches Figma Screen 6 radio options
export type DiabetesStatus =
  | 'yes_type1'
  | 'yes_type2'
  | 'yes_gestational'
  | 'no'
  | 'prefer_not_to_say';

export interface ProfileForm {
  // Step 1 — Basic Info
  avatarUri: string | null;
  gender: Gender | null;
  dateOfBirth: string | null;
  nationality: string;
  address: string;
  // Step 2 — Weight
  weight: number;
  weightUnit: WeightUnit;
  // Step 3 — Height
  heightCm: number;
  heightFeet: number;
  heightInches: number;
  heightUnit: HeightUnit;
  // Step 4 — Diabetes
  diabetesStatus: DiabetesStatus | null;
  // Step 5 — Medication (always show all 3 rows; user fills what applies)
  insulinSubtype: string | null;
  antidiabeticSubtype: string | null;
  otherMedication: string;
  // Step 6 — Family History of Diabetes
  familyHistoryDiabetes: 'yes' | 'no' | 'unknown' | null;
  // Step 7 — Chronic Diseases (checkboxes)
  chronicDiseases: string[];
  // Step 8 — General Family History (checkboxes)
  generalFamilyHistory: string[];
  // Step 9 — Allergies (checkboxes)
  allergies: string[];
  // Step 10 — Surgeries (tag input)
  surgeries: string[];
}

export type ProfileSetupPayload = ProfileForm & { userId: string };

export const INITIAL_PROFILE_FORM: ProfileForm = {
  avatarUri: null,
  gender: null,
  dateOfBirth: null,
  nationality: '',
  address: '',
  weight: 0,
  weightUnit: 'kg',
  heightCm: 0,
  heightFeet: 0,
  heightInches: 0,
  heightUnit: 'ft_in',
  diabetesStatus: null,
  insulinSubtype: null,
  antidiabeticSubtype: null,
  otherMedication: '',
  familyHistoryDiabetes: null,
  chronicDiseases: [],
  generalFamilyHistory: [],
  allergies: [],
  surgeries: [],
};

export function hasDiabetes(status: DiabetesStatus | null): boolean {
  return status === 'yes_type1' || status === 'yes_type2' || status === 'yes_gestational';
}
