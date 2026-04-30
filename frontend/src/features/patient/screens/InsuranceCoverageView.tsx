import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { Alert } from '@shared/components/ui/Alert';
import { Button } from '@shared/components/ui/Button';
import { useInsuranceCoverageFlow } from '@features/patient/hooks/useInsuranceCoverageFlow';
import {
  INSURED_SCENARIO_OPTIONS,
  NO_INSURANCE_SCENARIO_OPTIONS,
} from '@features/patient/types/insuranceCoverage.types';
import { BenefitDetailsCard } from '../components/insurance/BenefitDetailsCard';
import { BottomActionBar } from '../components/insurance/BottomActionBar';
import { CoverageBreakdownCard } from '../components/insurance/CoverageBreakdownCard';
import { CoverageFlowHeader } from '../components/insurance/CoverageFlowHeader';
import { CoverageScenarioSwitcher } from '../components/insurance/CoverageScenarioSwitcher';
import { CoverageVerificationStep } from '../components/insurance/CoverageVerificationStep';
import { DonorEligibilityCard } from '../components/insurance/DonorEligibilityCard';
import { DonorFundBanner } from '../components/insurance/DonorFundBanner';
import { InsuranceEntryQuestion } from '../components/insurance/InsuranceEntryQuestion';
import { InsuranceWizardStepper } from '../components/insurance/InsuranceWizardStepper';
import { InsuredInsuranceInfoStep } from '../components/insurance/InsuredInsuranceInfoStep';
import { InsuredPatientInfoStep } from '../components/insurance/InsuredPatientInfoStep';
import { InsuredSubscriberInfoStep } from '../components/insurance/InsuredSubscriberInfoStep';
import { NoInsuranceQualificationStep } from '../components/insurance/NoInsuranceQualificationStep';
import { OutOfPocketCard } from '../components/insurance/OutOfPocketCard';
import { StatusBanner } from '../components/insurance/StatusBanner';
import { UhcProfileCard } from '../components/insurance/UhcProfileCard';
import { VerificationErrorCard } from '../components/insurance/VerificationErrorCard';
import type { CoverageResult } from '../types/insuranceCoverage.types';

interface InsuranceCoverageViewProps {
  onExit: () => void;
  onBookConsultation: (result: CoverageResult) => void;
}

function getProfileSubtitle(
  outcome: string,
  memberId: string,
  t: (key: string, options?: Record<string, string | number>) => string,
) {
  if (outcome === 'insuredInactive') {
    return t('insuranceCoverage.results.inactiveProfileSubtitle');
  }

  if (outcome === 'insuredInconclusive') {
    return t('insuranceCoverage.results.inconclusiveProfileSubtitle');
  }

  return t('insuranceCoverage.results.profileSubtitle', { memberId });
}

function getInsuranceLineLabel(
  insurancePays: number,
  consultationCost: number,
  t: (key: string, options?: Record<string, string | number>) => string,
) {
  if (insurancePays <= 0) return t('insuranceCoverage.results.insurancePays');
  const percent = Math.round((insurancePays / consultationCost) * 100);
  return t('insuranceCoverage.results.uhcPays', { percent });
}

function translateResultValue(
  value: string,
  t: (key: string, options?: Record<string, string | number>) => string,
) {
  switch (value) {
    case 'Covered':
      return t('insuranceCoverage.results.covered');
    case 'Approved':
      return t('insuranceCoverage.results.approved');
    case 'Pending':
      return t('insuranceCoverage.results.pending');
    case 'In-network':
      return t('insuranceCoverage.results.inNetwork');
    case 'No':
      return t('insuranceCoverage.results.no');
    case 'Yes — included':
      return t('insuranceCoverage.results.yesIncluded');
    default:
      return value;
  }
}

function translateEmploymentStatusValue(
  value: string,
  t: (key: string, options?: Record<string, string | number>) => string,
) {
  switch (value) {
    case 'unemployed':
      return t('insuranceCoverage.employment.unemployed');
    case 'employed_full_time':
      return t('insuranceCoverage.employment.employedFullTime');
    case 'employed_part_time':
      return t('insuranceCoverage.employment.employedPartTime');
    case 'self_employed':
      return t('insuranceCoverage.employment.selfEmployed');
    case 'student':
      return t('insuranceCoverage.employment.student');
    case 'retired':
      return t('insuranceCoverage.employment.retired');
    case 'unable_to_work':
      return t('insuranceCoverage.employment.unableToWork');
    default:
      return value;
  }
}

export function InsuranceCoverageView({
  onExit,
  onBookConsultation,
}: InsuranceCoverageViewProps) {
  const { t } = useTranslation();
  const {
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
  } = useInsuranceCoverageFlow();

  const showBottomActionBar = step !== 'entryQuestion';
  const onHeaderBack = step === 'entryQuestion' ? onExit : handleBack;

  const secondaryButtons = secondaryActions.map((action) => ({
    id: action.id,
    label: t(action.labelKey),
    onPress: () => handleSecondaryAction(action.id),
  }));

  const showScenarioSwitcher = __DEV__ && step !== 'entryQuestion';
  const isNoInsuranceBranch = activePath === 'donor';

  let primaryActionLabel = '';
  let primaryActionDisabled = false;
  let primaryAction = () => {};
  let primaryReasonMessage: string | null = null;

  if (step === 'insuredStep1PatientInfo') {
    primaryActionLabel = t('insuranceCoverage.actions.next');
    primaryActionDisabled = !canContinuePatientInfo;
    primaryAction = handleContinuePatientInfo;
  } else if (step === 'insuredStep2InsuranceInfo') {
    primaryActionLabel = t('insuranceCoverage.actions.next');
    primaryActionDisabled = !canContinueInsuranceInfo;
    primaryAction = handleContinueInsuranceInfo;
  } else if (step === 'insuredStep3SubscriberInfo') {
    primaryActionLabel = t('insuranceCoverage.actions.checkCoverage');
    primaryAction = handleCheckCoverage;
  } else if (step === 'noInsuranceQualification') {
    primaryActionLabel = t('insuranceCoverage.actions.submit');
    primaryActionDisabled = !canSubmitNoInsuranceQualification;
    primaryAction = handleSubmitNoInsuranceQualification;
  } else if (step === 'verifying') {
    primaryActionLabel = t('insuranceCoverage.actions.checkCoverage');
    primaryActionDisabled = !isVerificationComplete;
    primaryAction = handleContinueFromVerification;
  } else if (step === 'result') {
    primaryActionLabel = t('insuranceCoverage.actions.bookConsultation');
    primaryActionDisabled = !result?.canBookConsultation;
    primaryAction = () => handleBookConsultation(onBookConsultation);
    primaryReasonMessage = blockerMessageKey ? t(blockerMessageKey) : null;
  }

  function renderRouteState() {
    if (routeViewState === 'error') {
      return (
        <View className="flex-1 items-center justify-center px-4">
          <View className="w-full gap-4">
            <Alert
              status="error"
              variant="outline"
              title={t('insuranceCoverage.errors.verificationFailedTitle')}
              description={t('insuranceCoverage.errors.verificationFailed')}
            />
            <Button
              label={t('common.retry')}
              onPress={handleBack}
              variant="filled"
              size="large"
              fullWidth
            />
          </View>
        </View>
      );
    }

    if (routeViewState === 'empty') {
      return (
        <View className="flex-1 items-center justify-center px-4">
          <View className="w-full gap-4">
            <Alert
              status="info"
              variant="outline"
              title={t('common.noData')}
              description={t('insuranceCoverage.emptyResultDescription')}
            />
            <Button
              label={t('common.back')}
              onPress={handleBack}
              variant="filled"
              size="large"
              fullWidth
            />
          </View>
        </View>
      );
    }

    return null;
  }

  function renderResultContent() {
    if (!result) return null;

    const benefitItems = [
      { label: t('insuranceCoverage.benefits.planType'), value: result.planType.toUpperCase() },
      { label: t('insuranceCoverage.benefits.network'), value: translateResultValue(result.networkStatus, t) },
      { label: t('insuranceCoverage.benefits.deductible'), value: result.deductible },
      { label: t('insuranceCoverage.benefits.referralRequired'), value: translateResultValue(result.referralRequired, t) },
      { label: t('insuranceCoverage.benefits.priorAuthorization'), value: translateResultValue(result.priorAuthorizationRequired, t) },
      { label: t('insuranceCoverage.benefits.rxCoverage'), value: translateResultValue(result.rxCoverage, t) },
    ];

    const insuranceLineLabel = getInsuranceLineLabel(
      result.insurancePays,
      result.consultationCost,
      t,
    );

    return (
      <View className="gap-6">
        {result.path === 'insurance' ? (
          <UhcProfileCard
            carrierLabel={`${result.carrierLabel.toUpperCase()} · ${result.planType.toUpperCase()}`}
            patientName={result.patientName}
            subtitle={getProfileSubtitle(result.outcome, result.memberId, t)}
            groupNumber={result.groupNumber}
            planType={result.planType}
            telehealthCoverage={translateResultValue(result.telehealthCoverage, t)}
            status={result.insuranceStatus}
          />
        ) : (
          <DonorEligibilityCard
            patientName={result.patientName}
            householdSize={noInsuranceForm.householdSize}
            householdIncome={noInsuranceForm.householdIncome}
            supportStatus={result.eligibilityStatus}
            supportAmount={result.donorCovers}
          />
        )}

        {result.outcome === 'insuredFull' ? (
          <StatusBanner
            tone="success"
            title={t('insuranceCoverage.results.fullyCoveredTitle')}
            description={t('insuranceCoverage.results.fullyCoveredDescription')}
          />
        ) : null}

        {result.outcome === 'insuredPartialWithDonor' ? (
          <StatusBanner
            tone="info"
            title={t('insuranceCoverage.results.partialWithDonorTitle')}
            description={t('insuranceCoverage.results.partialWithDonorDescription')}
          />
        ) : null}

        {result.outcome === 'insuredPartialNoDonor' ? (
          <DonorFundBanner
            title={t('insuranceCoverage.results.donorUnavailableTitle')}
            description={t('insuranceCoverage.results.donorUnavailableDescription')}
          />
        ) : null}

        {result.outcome === 'insuredInactive' ? (
          <StatusBanner
            tone="error"
            title={t('insuranceCoverage.results.inactiveTitle')}
            description={t('insuranceCoverage.results.inactiveDescription')}
          />
        ) : null}

        {result.outcome === 'noInsuranceDonorApproved' ? (
          <StatusBanner
            tone="success"
            title={t('insuranceCoverage.results.donorApprovedTitle')}
            description={t('insuranceCoverage.results.donorApprovedDescription')}
          />
        ) : null}

        {result.outcome === 'noInsuranceDonorUnavailable' ? (
          <DonorFundBanner
            title={t('insuranceCoverage.results.donorUnavailableTitle')}
            description={t('insuranceCoverage.results.donorUnavailableNoInsuranceDescription')}
          />
        ) : null}

        {(result.outcome === 'insuredInconclusive' || result.outcome === 'noInsuranceInconclusive') ? (
          <VerificationErrorCard
            title={t('insuranceCoverage.results.inconclusiveTitle')}
            description={t('insuranceCoverage.results.inconclusiveDescription')}
            fields={
              result.path === 'insurance'
                ? [
                    { label: t('insuranceCoverage.patientInfo.firstNameLabel'), value: insuredForm.firstName || t('insuranceCoverage.results.missingValue') },
                    { label: t('insuranceCoverage.insuranceInfo.memberIdLabel'), value: insuredForm.memberId || t('insuranceCoverage.results.missingValue') },
                    { label: t('insuranceCoverage.patientInfo.dateOfBirthLabel'), value: insuredForm.dateOfBirth || t('insuranceCoverage.results.missingValue') },
                  ]
                : [
                    { label: t('insuranceCoverage.noInsurance.fullNameLabel'), value: noInsuranceForm.fullName || t('insuranceCoverage.results.missingValue') },
                    { label: t('insuranceCoverage.noInsurance.dateOfBirthLabel'), value: noInsuranceForm.dateOfBirth || t('insuranceCoverage.results.missingValue') },
                    {
                      label: t('insuranceCoverage.noInsurance.employmentStatusLabel'),
                      value: noInsuranceForm.employmentStatus
                        ? translateEmploymentStatusValue(noInsuranceForm.employmentStatus, t)
                        : t('insuranceCoverage.results.missingValue'),
                    },
                  ]
            }
            ctaLabelKey="insuranceCoverage.actions.retryVerification"
            onRetry={() => handleSecondaryAction('retryVerification')}
          />
        ) : (
          <>
            <OutOfPocketCard
              balance={result.outOfPocketBalance}
              donorAvailableAmount={result.donorAvailableAmount}
              coveragePercent={result.coveragePercent}
            />

            <CoverageBreakdownCard
              consultationCost={result.consultationCost}
              insuranceLineLabel={insuranceLineLabel}
              insurancePays={result.insurancePays}
              patientCopay={result.patientCopay}
              donorCovers={result.donorCovers}
              finalYouPay={result.finalYouPay}
            />

            {result.path === 'insurance' ? (
              <BenefitDetailsCard
                title={t('insuranceCoverage.benefits.title')}
                items={benefitItems}
              />
            ) : null}
          </>
        )}

        {savedToWishlist ? (
          <StatusBanner
            tone="success"
            title={t('insuranceCoverage.results.wishlistSavedTitle')}
            description={t('insuranceCoverage.results.wishlistSavedDescription')}
          />
        ) : null}
      </View>
    );
  }

  function renderContent() {
    if (step === 'entryQuestion') {
      return (
        <InsuranceEntryQuestion
          onChooseInsurance={() => handleSelectInsurancePath('insurance')}
          onChooseNoInsurance={() => handleSelectInsurancePath('donor')}
        />
      );
    }

    if (step === 'insuredStep1PatientInfo') {
      return (
        <View className="gap-10">
          <InsuranceWizardStepper currentStep={0} />
          <InsuredPatientInfoStep
            form={insuredForm}
            errors={patientInfoErrors}
            onChange={handleInsuredChange}
            onBlur={handleInsuredBlur}
          />
        </View>
      );
    }

    if (step === 'insuredStep2InsuranceInfo') {
      return (
        <View className="gap-10">
          <InsuranceWizardStepper currentStep={1} />
          <InsuredInsuranceInfoStep
            form={insuredForm}
            errors={insuranceInfoErrors}
            onChange={handleInsuredChange}
            onBlur={handleInsuredBlur}
          />
        </View>
      );
    }

    if (step === 'insuredStep3SubscriberInfo') {
      return (
        <View className="gap-10">
          <InsuranceWizardStepper currentStep={2} />
          <InsuredSubscriberInfoStep
            form={insuredForm}
            onChange={handleInsuredChange}
          />
        </View>
      );
    }

    if (step === 'noInsuranceQualification') {
      return (
        <NoInsuranceQualificationStep
          form={noInsuranceForm}
          errors={noInsuranceErrors}
          onChange={handleNoInsuranceChange}
          onBlur={handleNoInsuranceBlur}
        />
      );
    }

    if (step === 'verifying') {
      return <CoverageVerificationStep currentStepIndex={verificationStepIndex} />;
    }

    return renderResultContent();
  }

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      <CoverageFlowHeader titleKey={headerTitleKey} onBack={onHeaderBack} />

      {routeViewState !== 'content' ? (
        renderRouteState()
      ) : (
        <KeyboardAvoidingView
          className="flex-1"
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <View className="flex-1">
            <ScrollView
              className="flex-1"
              contentContainerClassName={[
                'px-4 gap-6',
                showBottomActionBar ? 'pt-[28px] pb-40' : 'pb-16',
              ].join(' ')}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              {showScenarioSwitcher ? (
                <CoverageScenarioSwitcher
                  label={t('insuranceCoverage.devScenarioLabel')}
                  helperText={t('insuranceCoverage.devScenarioHelper')}
                  value={isNoInsuranceBranch ? noInsuranceScenarioId : insuredScenarioId}
                  options={isNoInsuranceBranch ? NO_INSURANCE_SCENARIO_OPTIONS : INSURED_SCENARIO_OPTIONS}
                  onChange={(value) => {
                    if (isNoInsuranceBranch) {
                      setNoInsuranceScenarioId(value as typeof noInsuranceScenarioId);
                    } else {
                      setInsuredScenarioId(value as typeof insuredScenarioId);
                    }
                  }}
                />
              ) : null}

              {renderContent()}
            </ScrollView>

            {showBottomActionBar ? (
              <BottomActionBar
                primaryLabel={primaryActionLabel}
                onPrimaryPress={primaryAction}
                primaryDisabled={primaryActionDisabled}
                reasonMessage={primaryReasonMessage}
                secondaryActions={step === 'result' ? secondaryButtons : undefined}
              />
            ) : null}
          </View>
        </KeyboardAvoidingView>
      )}
    </SafeAreaView>
  );
}
