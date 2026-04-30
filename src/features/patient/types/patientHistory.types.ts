import type { ProfileForm } from './profile.types';

export type PatientHistoryCategoryId =
  | 'chronicDiseases'
  | 'familyHistoryDiabetes'
  | 'generalFamilyHistory'
  | 'surgeries'
  | 'allergies';

export type PatientHistoryListCategoryId = Exclude<PatientHistoryCategoryId, 'familyHistoryDiabetes'>;

export type PatientHistoryEditableFields = Pick<
  ProfileForm,
  PatientHistoryCategoryId
>;
