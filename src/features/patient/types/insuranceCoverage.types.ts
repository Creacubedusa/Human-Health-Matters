export type CoverageFlowStep =
  | 'entryQuestion'
  | 'insuredStep1PatientInfo'
  | 'insuredStep2InsuranceInfo'
  | 'insuredStep3SubscriberInfo'
  | 'noInsuranceQualification'
  | 'verifying'
  | 'result';

export type CoveragePath = 'insurance' | 'donor';
export type InsuranceStatus = 'active' | 'inactive' | 'inconclusive';
export type EligibilityStatus = 'unknown' | 'eligible' | 'ineligible' | 'inconclusive';
export type DonorAvailability = 'checking' | 'available' | 'unavailable';

export type CoverageScenarioId =
  | 'insured_full'
  | 'insured_partial_with_donor'
  | 'insured_partial_no_donor'
  | 'insured_inactive'
  | 'insured_inconclusive'
  | 'no_insurance_donor_approved'
  | 'no_insurance_donor_unavailable'
  | 'no_insurance_inconclusive';

export type CoverageOutcome =
  | 'insuredFull'
  | 'insuredPartialWithDonor'
  | 'insuredPartialNoDonor'
  | 'insuredInactive'
  | 'insuredInconclusive'
  | 'noInsuranceDonorApproved'
  | 'noInsuranceDonorUnavailable'
  | 'noInsuranceInconclusive';

export type CoverageSecondaryAction =
  | 'retryVerification'
  | 'editInsuranceDetails'
  | 'requestDonorSupport'
  | 'saveToWishlist';

export type EmploymentStatus =
  | 'unemployed'
  | 'employed_full_time'
  | 'employed_part_time'
  | 'self_employed'
  | 'student'
  | 'retired'
  | 'unable_to_work';

export type RelationshipToSubscriber =
  | 'self'
  | 'spouse'
  | 'parent'
  | 'child'
  | 'other';

export interface InsuredCoverageForm {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  insuranceProvider: string;
  memberId: string;
  groupNumber: string;
  subscriberFirstName: string;
  subscriberLastName: string;
  subscriberDateOfBirth: string;
  relationshipToSubscriber: string;
}

export interface NoInsuranceQualificationForm {
  fullName: string;
  dateOfBirth: string;
  employmentStatus: string;
  householdSize: string;
  householdIncome: string;
  proofOfIncomeUri: string | null;
}

export type InsuredCoverageErrors = Partial<Record<keyof InsuredCoverageForm, string>>;
export type NoInsuranceQualificationErrors = Partial<Record<keyof NoInsuranceQualificationForm, string>>;

export interface CoverageVerificationRequest {
  path: CoveragePath;
  insuredForm: InsuredCoverageForm;
  noInsuranceForm: NoInsuranceQualificationForm;
  scenarioId: CoverageScenarioId;
}

export interface CoverageResult {
  outcome: CoverageOutcome;
  scenarioId: CoverageScenarioId;
  path: CoveragePath;
  insuranceStatus: InsuranceStatus;
  eligibilityStatus: EligibilityStatus;
  donorAvailability: DonorAvailability;
  coveragePercent: 0 | 25 | 50 | 75 | 100;
  consultationCost: number;
  insurancePays: number;
  patientCopay: number;
  donorCovers: number;
  finalYouPay: number;
  outOfPocketBalance: number;
  donorAvailableAmount: number;
  patientName: string;
  memberId: string;
  groupNumber: string;
  planType: string;
  telehealthCoverage: string;
  carrierLabel: string;
  networkStatus: string;
  deductible: string;
  referralRequired: string;
  priorAuthorizationRequired: string;
  rxCoverage: string;
  secondaryActions: CoverageSecondaryAction[];
  canBookConsultation: boolean;
}

export interface CoverageScenarioOption {
  label: string;
  value: CoverageScenarioId;
}

export const COVERAGE_SCENARIO_OPTIONS: CoverageScenarioOption[] = [
  { label: 'Insured: 100% covered', value: 'insured_full' },
  { label: 'Insured: partial + donor', value: 'insured_partial_with_donor' },
  { label: 'Insured: partial, no donor', value: 'insured_partial_no_donor' },
  { label: 'Insured: inactive plan', value: 'insured_inactive' },
  { label: 'Insured: inconclusive', value: 'insured_inconclusive' },
  { label: 'No insurance: donor approved', value: 'no_insurance_donor_approved' },
  { label: 'No insurance: donor unavailable', value: 'no_insurance_donor_unavailable' },
  { label: 'No insurance: inconclusive', value: 'no_insurance_inconclusive' },
];

export const INSURED_SCENARIO_OPTIONS = COVERAGE_SCENARIO_OPTIONS.filter((option) =>
  option.value.startsWith('insured_'),
);

export const NO_INSURANCE_SCENARIO_OPTIONS = COVERAGE_SCENARIO_OPTIONS.filter((option) =>
  option.value.startsWith('no_insurance_'),
);

export const EMPLOYMENT_STATUS_OPTIONS: Array<{ labelKey: string; value: EmploymentStatus }> = [
  { labelKey: 'insuranceCoverage.employment.unemployed', value: 'unemployed' },
  { labelKey: 'insuranceCoverage.employment.employedFullTime', value: 'employed_full_time' },
  { labelKey: 'insuranceCoverage.employment.employedPartTime', value: 'employed_part_time' },
  { labelKey: 'insuranceCoverage.employment.selfEmployed', value: 'self_employed' },
  { labelKey: 'insuranceCoverage.employment.student', value: 'student' },
  { labelKey: 'insuranceCoverage.employment.retired', value: 'retired' },
  { labelKey: 'insuranceCoverage.employment.unableToWork', value: 'unable_to_work' },
];

export const RELATIONSHIP_OPTIONS: Array<{ labelKey: string; value: RelationshipToSubscriber }> = [
  { labelKey: 'insuranceCoverage.relationship.self', value: 'self' },
  { labelKey: 'insuranceCoverage.relationship.spouse', value: 'spouse' },
  { labelKey: 'insuranceCoverage.relationship.parent', value: 'parent' },
  { labelKey: 'insuranceCoverage.relationship.child', value: 'child' },
  { labelKey: 'insuranceCoverage.relationship.other', value: 'other' },
];

export const GENDER_OPTIONS = [
  { labelKey: 'insuranceCoverage.gender.female', value: 'female' },
  { labelKey: 'insuranceCoverage.gender.male', value: 'male' },
  { labelKey: 'insuranceCoverage.gender.other', value: 'other' },
];
