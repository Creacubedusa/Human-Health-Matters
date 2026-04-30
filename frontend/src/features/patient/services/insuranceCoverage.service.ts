import type {
  CoverageResult,
  CoverageVerificationRequest,
  CoverageScenarioId,
} from '../types/insuranceCoverage.types';
import { http } from '@shared/api/http';

const UHC_PROVIDER = 'United Healthcare';
const FALLBACK_PLAN = 'PPO Plus';
const DEFAULT_CONSULTATION_COST = 100;

function normalizeName(firstName: string, lastName: string) {
  return `${firstName} ${lastName}`.trim() || 'Angela Dairo';
}

function normalizeDonorName(fullName: string) {
  return fullName.trim() || 'Angela Dairo';
}

function buildBaseResult(
  request: CoverageVerificationRequest,
  overrides: Partial<CoverageResult>,
): CoverageResult {
  const insuredName = normalizeName(request.insuredForm.firstName, request.insuredForm.lastName);
  const donorName = normalizeDonorName(request.noInsuranceForm.fullName);

  return {
    outcome: 'insuredFull',
    scenarioId: request.scenarioId,
    path: request.path,
    insuranceStatus: 'active',
    eligibilityStatus: request.path === 'donor' ? 'eligible' : 'unknown',
    donorAvailability: 'available',
    coveragePercent: 100,
    consultationCost: DEFAULT_CONSULTATION_COST,
    insurancePays: 100,
    patientCopay: 0,
    donorCovers: 0,
    finalYouPay: 0,
    outOfPocketBalance: 0,
    donorAvailableAmount: 0,
    patientName: request.path === 'insurance' ? insuredName : donorName,
    memberId: request.insuredForm.memberId.trim() || 'U98765432100',
    groupNumber: request.insuredForm.groupNumber.trim() || '0123456',
    planType: FALLBACK_PLAN,
    telehealthCoverage: 'Covered',
    carrierLabel: UHC_PROVIDER,
    networkStatus: 'In-network',
    deductible: '$75 out of $100',
    referralRequired: 'No',
    priorAuthorizationRequired: 'No',
    rxCoverage: 'Yes — included',
    secondaryActions: [],
    canBookConsultation: true,
    ...overrides,
  };
}

function buildScenario(request: CoverageVerificationRequest): CoverageResult {
  switch (request.scenarioId) {
    case 'insured_full':
      return buildBaseResult(request, {
        outcome: 'insuredFull',
        path: 'insurance',
        insurancePays: 100,
        patientCopay: 0,
        donorCovers: 0,
        finalYouPay: 0,
        outOfPocketBalance: 0,
        donorAvailableAmount: 0,
        coveragePercent: 100,
      });

    case 'insured_partial_with_donor':
      return buildBaseResult(request, {
        outcome: 'insuredPartialWithDonor',
        path: 'insurance',
        insurancePays: 75,
        patientCopay: 25,
        donorCovers: 25,
        finalYouPay: 0,
        outOfPocketBalance: 25,
        donorAvailableAmount: 75,
        coveragePercent: 100,
      });

    case 'insured_partial_no_donor':
      return buildBaseResult(request, {
        outcome: 'insuredPartialNoDonor',
        path: 'insurance',
        donorAvailability: 'unavailable',
        insurancePays: 75,
        patientCopay: 25,
        donorCovers: 0,
        finalYouPay: 25,
        outOfPocketBalance: 25,
        donorAvailableAmount: 0,
        coveragePercent: 75,
        secondaryActions: ['editInsuranceDetails', 'requestDonorSupport', 'saveToWishlist'],
        canBookConsultation: false,
      });

    case 'insured_inactive':
      return buildBaseResult(request, {
        outcome: 'insuredInactive',
        path: 'insurance',
        insuranceStatus: 'inactive',
        insurancePays: 0,
        patientCopay: 100,
        donorCovers: 0,
        finalYouPay: 100,
        outOfPocketBalance: 100,
        donorAvailableAmount: 0,
        coveragePercent: 0,
        secondaryActions: ['editInsuranceDetails', 'requestDonorSupport', 'saveToWishlist'],
        canBookConsultation: false,
      });

    case 'insured_inconclusive':
      return buildBaseResult(request, {
        outcome: 'insuredInconclusive',
        path: 'insurance',
        insuranceStatus: 'inconclusive',
        eligibilityStatus: 'inconclusive',
        donorAvailability: 'checking',
        insurancePays: 0,
        patientCopay: 100,
        donorCovers: 0,
        finalYouPay: 100,
        outOfPocketBalance: 100,
        donorAvailableAmount: 0,
        coveragePercent: 0,
        secondaryActions: ['retryVerification', 'editInsuranceDetails'],
        canBookConsultation: false,
      });

    case 'no_insurance_donor_approved':
      return buildBaseResult(request, {
        outcome: 'noInsuranceDonorApproved',
        path: 'donor',
        insuranceStatus: 'inactive',
        eligibilityStatus: 'eligible',
        donorAvailability: 'available',
        insurancePays: 0,
        patientCopay: 100,
        donorCovers: 100,
        finalYouPay: 0,
        outOfPocketBalance: 100,
        donorAvailableAmount: 100,
        coveragePercent: 100,
        memberId: 'N/A',
        groupNumber: request.noInsuranceForm.householdSize.trim(),
        planType: 'Donor Support',
        telehealthCoverage: 'Approved',
        carrierLabel: 'HMM DONOR SUPPORT',
      });

    case 'no_insurance_donor_unavailable':
      return buildBaseResult(request, {
        outcome: 'noInsuranceDonorUnavailable',
        path: 'donor',
        insuranceStatus: 'inactive',
        eligibilityStatus: 'eligible',
        donorAvailability: 'unavailable',
        insurancePays: 0,
        patientCopay: 100,
        donorCovers: 0,
        finalYouPay: 100,
        outOfPocketBalance: 100,
        donorAvailableAmount: 0,
        coveragePercent: 0,
        memberId: 'N/A',
        groupNumber: request.noInsuranceForm.householdSize.trim(),
        planType: 'Donor Support',
        telehealthCoverage: 'Pending',
        carrierLabel: 'HMM DONOR SUPPORT',
        secondaryActions: ['retryVerification', 'saveToWishlist'],
        canBookConsultation: false,
      });

    case 'no_insurance_inconclusive':
      return buildBaseResult(request, {
        outcome: 'noInsuranceInconclusive',
        path: 'donor',
        insuranceStatus: 'inactive',
        eligibilityStatus: 'inconclusive',
        donorAvailability: 'checking',
        insurancePays: 0,
        patientCopay: 100,
        donorCovers: 0,
        finalYouPay: 100,
        outOfPocketBalance: 100,
        donorAvailableAmount: 0,
        coveragePercent: 0,
        memberId: 'N/A',
        groupNumber: request.noInsuranceForm.householdSize.trim(),
        planType: 'Donor Support',
        telehealthCoverage: 'Pending',
        carrierLabel: 'HMM DONOR SUPPORT',
        secondaryActions: ['retryVerification', 'saveToWishlist'],
        canBookConsultation: false,
      });
  }
}

export async function mockVerifyCoverage(request: CoverageVerificationRequest): Promise<CoverageResult> {
  await new Promise((resolve) => setTimeout(resolve, 250));
  return buildScenario(request);
}

export async function verifyCoverage(request: CoverageVerificationRequest): Promise<CoverageResult> {
  const res = await http.post<CoverageResult>('/insurance/verify', request);
  return res.data;
}

export function isScenarioForPath(path: 'insurance' | 'donor', scenarioId: CoverageScenarioId) {
  return path === 'insurance'
    ? scenarioId.startsWith('insured_')
    : scenarioId.startsWith('no_insurance_');
}
