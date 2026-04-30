import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { usePatientStore } from '../store/patient.store';
import {
  isScenarioForPath,
  verifyCoverage,
} from '../services/insuranceCoverage.service';
import type {
  CoverageFlowStep,
  CoveragePath,
  CoverageResult,
  CoverageScenarioId,
  CoverageSecondaryAction,
  InsuredCoverageErrors,
  InsuredCoverageForm,
  NoInsuranceQualificationErrors,
  NoInsuranceQualificationForm,
} from '../types/insuranceCoverage.types';

type VerificationStepIndex = 0 | 1 | 2;
type RouteViewState = 'content' | 'error' | 'empty';
type InsuredSection = 'patientInfo' | 'insuranceInfo';

const INSURED_DEFAULT_SCENARIO: CoverageScenarioId = 'insured_partial_with_donor';
const NO_INSURANCE_DEFAULT_SCENARIO: CoverageScenarioId = 'no_insurance_donor_approved';

const EMPTY_INSURED_FORM: InsuredCoverageForm = {
  firstName: '',
  lastName: '',
  dateOfBirth: '',
  gender: '',
  insuranceProvider: 'United Healthcare',
  memberId: '',
  groupNumber: '',
  subscriberFirstName: '',
  subscriberLastName: '',
  subscriberDateOfBirth: '',
  relationshipToSubscriber: '',
};

const EMPTY_NO_INSURANCE_FORM: NoInsuranceQualificationForm = {
  fullName: '',
  dateOfBirth: '',
  employmentStatus: '',
  householdSize: '',
  householdIncome: '',
  proofOfIncomeUri: null,
};

const SECONDARY_ACTION_LABEL_KEYS: Record<CoverageSecondaryAction, string> = {
  retryVerification: 'insuranceCoverage.actions.retryVerification',
  editInsuranceDetails: 'insuranceCoverage.actions.editInsuranceDetails',
  requestDonorSupport: 'insuranceCoverage.actions.requestDonorSupport',
  saveToWishlist: 'insuranceCoverage.actions.saveToWishlist',
};

function validatePatientInfo(form: InsuredCoverageForm): InsuredCoverageErrors {
  const errors: InsuredCoverageErrors = {};

  if (!form.firstName.trim()) errors.firstName = 'insuranceCoverage.errors.firstNameRequired';
  if (!form.lastName.trim()) errors.lastName = 'insuranceCoverage.errors.lastNameRequired';
  if (!form.dateOfBirth.trim()) errors.dateOfBirth = 'insuranceCoverage.errors.dateOfBirthRequired';
  if (!form.gender.trim()) errors.gender = 'insuranceCoverage.errors.genderRequired';

  return errors;
}

function validateInsuranceInfo(form: InsuredCoverageForm): InsuredCoverageErrors {
  const errors: InsuredCoverageErrors = {};

  if (!form.memberId.trim()) errors.memberId = 'insuranceCoverage.errors.memberIdRequired';

  return errors;
}

function validateNoInsuranceQualification(
  form: NoInsuranceQualificationForm,
): NoInsuranceQualificationErrors {
  const errors: NoInsuranceQualificationErrors = {};

  if (!form.fullName.trim()) errors.fullName = 'insuranceCoverage.errors.fullNameRequired';
  if (!form.dateOfBirth.trim()) errors.dateOfBirth = 'insuranceCoverage.errors.dateOfBirthRequired';
  if (!form.employmentStatus.trim()) errors.employmentStatus = 'insuranceCoverage.errors.employmentStatusRequired';
  if (!form.householdSize.trim()) errors.householdSize = 'insuranceCoverage.errors.householdSizeRequired';
  if (!form.householdIncome.trim()) errors.householdIncome = 'insuranceCoverage.errors.householdIncomeRequired';
  if (!form.proofOfIncomeUri) errors.proofOfIncomeUri = 'insuranceCoverage.errors.proofOfIncomeRequired';

  return errors;
}

function filterVisibleErrors<T extends string>(
  allErrors: Partial<Record<T, string>>,
  touchedFields: Set<T>,
  submitted: boolean,
) {
  if (submitted) return allErrors;

  const visible: Partial<Record<T, string>> = {};
  touchedFields.forEach((field) => {
    if (allErrors[field]) {
      visible[field] = allErrors[field];
    }
  });

  return visible;
}

function deriveVerificationScenario(
  path: CoveragePath,
  insuredScenarioId: CoverageScenarioId,
  noInsuranceScenarioId: CoverageScenarioId,
) {
  if (path === 'insurance') {
    return isScenarioForPath(path, insuredScenarioId) ? insuredScenarioId : INSURED_DEFAULT_SCENARIO;
  }

  return isScenarioForPath(path, noInsuranceScenarioId) ? noInsuranceScenarioId : NO_INSURANCE_DEFAULT_SCENARIO;
}

export interface SecondaryActionDescriptor {
  id: CoverageSecondaryAction;
  labelKey: string;
}

export interface UseInsuranceCoverageFlowResult {
  step: CoverageFlowStep;
  activePath: CoveragePath;
  headerTitleKey: string;
  routeViewState: RouteViewState;
  insuredForm: InsuredCoverageForm;
  noInsuranceForm: NoInsuranceQualificationForm;
  patientInfoErrors: InsuredCoverageErrors;
  insuranceInfoErrors: InsuredCoverageErrors;
  noInsuranceErrors: NoInsuranceQualificationErrors;
  canContinuePatientInfo: boolean;
  canContinueInsuranceInfo: boolean;
  canSubmitNoInsuranceQualification: boolean;
  verificationStepIndex: VerificationStepIndex;
  isVerificationComplete: boolean;
  result: CoverageResult | null;
  blockerMessageKey: string | null;
  savedToWishlist: boolean;
  insuredScenarioId: CoverageScenarioId;
  noInsuranceScenarioId: CoverageScenarioId;
  secondaryActions: SecondaryActionDescriptor[];
  handleSelectInsurancePath: (path: CoveragePath) => void;
  handleBack: () => void;
  handleInsuredChange: <K extends keyof InsuredCoverageForm>(field: K, value: InsuredCoverageForm[K]) => void;
  handleInsuredBlur: (field: keyof InsuredCoverageForm) => void;
  handleNoInsuranceChange: <K extends keyof NoInsuranceQualificationForm>(
    field: K,
    value: NoInsuranceQualificationForm[K],
  ) => void;
  handleNoInsuranceBlur: (field: keyof NoInsuranceQualificationForm) => void;
  handleContinuePatientInfo: () => void;
  handleContinueInsuranceInfo: () => void;
  handleCheckCoverage: () => void;
  handleSubmitNoInsuranceQualification: () => void;
  handleContinueFromVerification: () => void;
  handleBookConsultation: (onBook: (result: CoverageResult) => void) => void;
  handleSecondaryAction: (action: CoverageSecondaryAction) => void;
  setInsuredScenarioId: (scenarioId: CoverageScenarioId) => void;
  setNoInsuranceScenarioId: (scenarioId: CoverageScenarioId) => void;
}

export function useInsuranceCoverageFlow(): UseInsuranceCoverageFlowResult {
  const profile = usePatientStore((state) => state.profile);

  const [step, setStep] = useState<CoverageFlowStep>('entryQuestion');
  const [activePath, setActivePath] = useState<CoveragePath>('insurance');
  const [insuredForm, setInsuredForm] = useState<InsuredCoverageForm>(() => ({
    ...EMPTY_INSURED_FORM,
    dateOfBirth: profile?.dateOfBirth ?? '',
    gender: profile?.gender ?? '',
  }));
  const [noInsuranceForm, setNoInsuranceForm] = useState<NoInsuranceQualificationForm>(() => ({
    ...EMPTY_NO_INSURANCE_FORM,
    dateOfBirth: profile?.dateOfBirth ?? '',
  }));
  const [patientInfoTouched, setPatientInfoTouched] = useState<Set<keyof InsuredCoverageForm>>(new Set());
  const [insuranceInfoTouched, setInsuranceInfoTouched] = useState<Set<keyof InsuredCoverageForm>>(new Set());
  const [noInsuranceTouched, setNoInsuranceTouched] = useState<Set<keyof NoInsuranceQualificationForm>>(new Set());
  const [submittedSections, setSubmittedSections] = useState<Record<InsuredSection | 'noInsurance', boolean>>({
    patientInfo: false,
    insuranceInfo: false,
    noInsurance: false,
  });
  const [verificationStepIndex, setVerificationStepIndex] = useState<VerificationStepIndex>(0);
  const [isVerificationComplete, setIsVerificationComplete] = useState(false);
  const [result, setResult] = useState<CoverageResult | null>(null);
  const [routeError, setRouteError] = useState<string | null>(null);
  const [savedToWishlist, setSavedToWishlist] = useState(false);
  const [insuredScenarioId, setInsuredScenarioId] = useState<CoverageScenarioId>(INSURED_DEFAULT_SCENARIO);
  const [noInsuranceScenarioId, setNoInsuranceScenarioId] = useState<CoverageScenarioId>(NO_INSURANCE_DEFAULT_SCENARIO);

  const verificationTimersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const verificationRunIdRef = useRef(0);

  const patientInfoAllErrors = useMemo(() => validatePatientInfo(insuredForm), [insuredForm]);
  const insuranceInfoAllErrors = useMemo(() => validateInsuranceInfo(insuredForm), [insuredForm]);
  const noInsuranceAllErrors = useMemo(
    () => validateNoInsuranceQualification(noInsuranceForm),
    [noInsuranceForm],
  );

  const patientInfoErrors = useMemo(
    () => filterVisibleErrors(patientInfoAllErrors, patientInfoTouched, submittedSections.patientInfo),
    [patientInfoAllErrors, patientInfoTouched, submittedSections.patientInfo],
  );
  const insuranceInfoErrors = useMemo(
    () => filterVisibleErrors(insuranceInfoAllErrors, insuranceInfoTouched, submittedSections.insuranceInfo),
    [insuranceInfoAllErrors, insuranceInfoTouched, submittedSections.insuranceInfo],
  );
  const noInsuranceErrors = useMemo(
    () => filterVisibleErrors(noInsuranceAllErrors, noInsuranceTouched, submittedSections.noInsurance),
    [noInsuranceAllErrors, noInsuranceTouched, submittedSections.noInsurance],
  );

  const canContinuePatientInfo = Object.keys(patientInfoAllErrors).length === 0;
  const canContinueInsuranceInfo = Object.keys(insuranceInfoAllErrors).length === 0;
  const canSubmitNoInsuranceQualification = Object.keys(noInsuranceAllErrors).length === 0;

  const clearVerificationTimers = useCallback(() => {
    verificationTimersRef.current.forEach((timer) => clearTimeout(timer));
    verificationTimersRef.current = [];
  }, []);

  useEffect(() => () => clearVerificationTimers(), [clearVerificationTimers]);

  const headerTitleKey = useMemo(() => {
    if (step === 'verifying') return 'insuranceCoverage.verifyingHeaderTitle';
    if (step === 'result') return 'insuranceCoverage.coverageHeaderTitle';
    return 'insuranceCoverage.headerTitle';
  }, [step]);

  const routeViewState: RouteViewState = useMemo(() => {
    if (routeError) return 'error';
    if (step === 'result' && !result) return 'empty';
    return 'content';
  }, [routeError, step, result]);

  const secondaryActions = useMemo<SecondaryActionDescriptor[]>(
    () =>
      (result?.secondaryActions ?? []).map((action) => ({
        id: action,
        labelKey: SECONDARY_ACTION_LABEL_KEYS[action],
      })),
    [result],
  );

  const blockerMessageKey = result && !result.canBookConsultation
    ? 'insuranceCoverage.bookingDisabledReason'
    : null;

  const startVerification = useCallback((path: CoveragePath) => {
    clearVerificationTimers();
    const currentRunId = verificationRunIdRef.current + 1;
    verificationRunIdRef.current = currentRunId;

    const scenarioId = deriveVerificationScenario(path, insuredScenarioId, noInsuranceScenarioId);

    setRouteError(null);
    setResult(null);
    setSavedToWishlist(false);
    setActivePath(path);
    setStep('verifying');
    setVerificationStepIndex(0);
    setIsVerificationComplete(false);

    verificationTimersRef.current = [
      setTimeout(() => {
        if (verificationRunIdRef.current !== currentRunId) return;
        setVerificationStepIndex(1);
      }, 900),
      setTimeout(() => {
        if (verificationRunIdRef.current !== currentRunId) return;
        setVerificationStepIndex(2);
      }, 1800),
      setTimeout(async () => {
        if (verificationRunIdRef.current !== currentRunId) return;

        try {
          const nextResult = await verifyCoverage({
            path,
            insuredForm,
            noInsuranceForm,
            scenarioId,
          });

          if (verificationRunIdRef.current !== currentRunId) return;
          setResult(nextResult);
          setIsVerificationComplete(true);
        } catch {
          if (verificationRunIdRef.current !== currentRunId) return;
          setRouteError('insuranceCoverage.errors.verificationFailed');
        }
      }, 2900),
    ];
  }, [
    clearVerificationTimers,
    insuredForm,
    insuredScenarioId,
    noInsuranceForm,
    noInsuranceScenarioId,
  ]);

  const handleSelectInsurancePath = useCallback((path: CoveragePath) => {
    setRouteError(null);
    setSavedToWishlist(false);
    setResult(null);
    setPatientInfoTouched(new Set());
    setInsuranceInfoTouched(new Set());
    setNoInsuranceTouched(new Set());
    setSubmittedSections({
      patientInfo: false,
      insuranceInfo: false,
      noInsurance: false,
    });
    setVerificationStepIndex(0);
    setIsVerificationComplete(false);
    setActivePath(path);
    setStep(path === 'insurance' ? 'insuredStep1PatientInfo' : 'noInsuranceQualification');
  }, []);

  const handleInsuredChange = useCallback(<K extends keyof InsuredCoverageForm>(
    field: K,
    value: InsuredCoverageForm[K],
  ) => {
    setInsuredForm((current) => ({ ...current, [field]: value }));
  }, []);

  const handleInsuredBlur = useCallback((field: keyof InsuredCoverageForm) => {
    if (
      field === 'firstName' ||
      field === 'lastName' ||
      field === 'dateOfBirth' ||
      field === 'gender'
    ) {
      setPatientInfoTouched((current) => new Set(current).add(field));
      return;
    }

    setInsuranceInfoTouched((current) => new Set(current).add(field));
  }, []);

  const handleNoInsuranceChange = useCallback(<K extends keyof NoInsuranceQualificationForm>(
    field: K,
    value: NoInsuranceQualificationForm[K],
  ) => {
    setNoInsuranceForm((current) => ({ ...current, [field]: value }));
  }, []);

  const handleNoInsuranceBlur = useCallback((field: keyof NoInsuranceQualificationForm) => {
    setNoInsuranceTouched((current) => new Set(current).add(field));
  }, []);

  const handleContinuePatientInfo = useCallback(() => {
    setSubmittedSections((current) => ({ ...current, patientInfo: true }));
    if (!canContinuePatientInfo) return;

    setStep('insuredStep2InsuranceInfo');
  }, [canContinuePatientInfo]);

  const handleContinueInsuranceInfo = useCallback(() => {
    setSubmittedSections((current) => ({ ...current, insuranceInfo: true }));
    if (!canContinueInsuranceInfo) return;

    setStep('insuredStep3SubscriberInfo');
  }, [canContinueInsuranceInfo]);

  const handleCheckCoverage = useCallback(() => {
    startVerification('insurance');
  }, [startVerification]);

  const handleSubmitNoInsuranceQualification = useCallback(() => {
    setSubmittedSections((current) => ({ ...current, noInsurance: true }));
    if (!canSubmitNoInsuranceQualification) return;

    startVerification('donor');
  }, [canSubmitNoInsuranceQualification, startVerification]);

  const handleContinueFromVerification = useCallback(() => {
    if (!isVerificationComplete || !result) return;
    setStep('result');
  }, [isVerificationComplete, result]);

  const handleBookConsultation = useCallback((onBook: (nextResult: CoverageResult) => void) => {
    if (!result?.canBookConsultation) return;
    onBook(result);
  }, [result]);

  const handleRequestDonorSupport = useCallback(() => {
    setNoInsuranceForm((current) => ({
      ...current,
      fullName: current.fullName || `${insuredForm.firstName} ${insuredForm.lastName}`.trim(),
      dateOfBirth: current.dateOfBirth || insuredForm.dateOfBirth,
    }));
    setActivePath('donor');
    setStep('noInsuranceQualification');
  }, [insuredForm.dateOfBirth, insuredForm.firstName, insuredForm.lastName]);

  const handleSecondaryAction = useCallback((action: CoverageSecondaryAction) => {
    switch (action) {
      case 'retryVerification':
        startVerification(activePath);
        return;
      case 'editInsuranceDetails':
        setStep('insuredStep2InsuranceInfo');
        return;
      case 'requestDonorSupport':
        handleRequestDonorSupport();
        return;
      case 'saveToWishlist':
        setSavedToWishlist(true);
        return;
    }
  }, [activePath, handleRequestDonorSupport, startVerification]);

  const handleBack = useCallback(() => {
    clearVerificationTimers();
    setRouteError(null);

    switch (step) {
      case 'insuredStep1PatientInfo':
      case 'noInsuranceQualification':
        setStep('entryQuestion');
        return;
      case 'insuredStep2InsuranceInfo':
        setStep('insuredStep1PatientInfo');
        return;
      case 'insuredStep3SubscriberInfo':
        setStep('insuredStep2InsuranceInfo');
        return;
      case 'verifying':
      case 'result':
        setStep(activePath === 'insurance' ? 'insuredStep3SubscriberInfo' : 'noInsuranceQualification');
        return;
      case 'entryQuestion':
      default:
        return;
    }
  }, [activePath, clearVerificationTimers, step]);

  return {
    step,
    activePath,
    headerTitleKey,
    routeViewState,
    insuredForm,
    noInsuranceForm,
    patientInfoErrors,
    insuranceInfoErrors,
    noInsuranceErrors,
    canContinuePatientInfo,
    canContinueInsuranceInfo,
    canSubmitNoInsuranceQualification,
    verificationStepIndex,
    isVerificationComplete,
    result,
    blockerMessageKey,
    savedToWishlist,
    insuredScenarioId,
    noInsuranceScenarioId,
    secondaryActions,
    handleSelectInsurancePath,
    handleBack,
    handleInsuredChange,
    handleInsuredBlur,
    handleNoInsuranceChange,
    handleNoInsuranceBlur,
    handleContinuePatientInfo,
    handleContinueInsuranceInfo,
    handleCheckCoverage,
    handleSubmitNoInsuranceQualification,
    handleContinueFromVerification,
    handleBookConsultation,
    handleSecondaryAction,
    setInsuredScenarioId,
    setNoInsuranceScenarioId,
  };
}
