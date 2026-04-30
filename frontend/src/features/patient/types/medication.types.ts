import type { ProfileForm } from './profile.types';

export type MedicationCategoryId = 'medicationTypes' | 'currentMedications';

export type MedicationEditableFields = Pick<ProfileForm, MedicationCategoryId>;
