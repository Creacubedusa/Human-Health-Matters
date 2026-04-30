import { ActivityIndicator, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { primitiveColors } from '@design/tokens';
import { Button } from '@shared/components/ui/Button';
import { useCarePlans } from '../hooks/useCarePlans';
import { CarePlanCollapsibleSection } from '../components/care-plan/CarePlanCollapsibleSection';
import { CarePlanDiagnosisRow } from '../components/care-plan/CarePlanDiagnosisRow';
import { CarePlanDoctorSummaryCard } from '../components/care-plan/CarePlanDoctorSummaryCard';
import { CarePlanHeader } from '../components/care-plan/CarePlanHeader';
import { CarePlanNoteBox } from '../components/care-plan/CarePlanNoteBox';
import { CarePlanPrescriptionItem } from '../components/care-plan/CarePlanPrescriptionItem';
import { CarePlanRecommendedTestRow } from '../components/care-plan/CarePlanRecommendedTestRow';

export interface CarePlanDetailViewProps {
  carePlanId: string;
  onBack: () => void;
}

export function CarePlanDetailView({ carePlanId, onBack }: CarePlanDetailViewProps) {
  const { t } = useTranslation();
  const { status, getCarePlanById, retry } = useCarePlans();
  const carePlan = getCarePlanById(carePlanId);

  const header = (
    <CarePlanHeader
      title={t('carePlan.detailHeaderTitle')}
      backLabel={t('common.back')}
      onBack={onBack}
    />
  );

  if (status === 'loading') {
    return (
      <SafeAreaView className="flex-1 bg-white" edges={['top']}>
        {header}
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={primitiveColors['primary-500']} />
        </View>
      </SafeAreaView>
    );
  }

  if (status === 'error') {
    return (
      <SafeAreaView className="flex-1 bg-white" edges={['top']}>
        {header}
        <View className="flex-1 items-center justify-center px-6 gap-4">
          <Text className="text-b3 font-sans text-grey-700 text-center">
            {t('carePlan.errorMessage')}
          </Text>
          <Button label={t('common.retry')} onPress={retry} size="medium" />
        </View>
      </SafeAreaView>
    );
  }

  if (!carePlan) {
    return (
      <SafeAreaView className="flex-1 bg-white" edges={['top']}>
        {header}
        <View className="flex-1 items-center justify-center px-6 gap-4">
          <Text className="text-s2 font-semibold font-sans text-grey-900 text-center">
            {t('carePlan.notFoundTitle')}
          </Text>
          <Button label={t('common.back')} onPress={onBack} size="medium" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      {header}

      <ScrollView
        className="flex-1"
        contentContainerClassName="px-2 pt-4 pb-8 gap-4"
        showsVerticalScrollIndicator={false}
      >
        <CarePlanDoctorSummaryCard
          carePlan={carePlan}
          labels={{
            duration: t('carePlan.duration'),
            sessionType: t('carePlan.sessionType'),
            date: t('carePlan.date'),
          }}
        />

        <CarePlanCollapsibleSection title={t('carePlan.soapNotes')} bordered={false}>
          <View className="gap-4">
            <CarePlanNoteBox
              title={t('carePlan.subjective')}
              body={carePlan.soapNotes.subjective}
            />
            <CarePlanNoteBox
              title={t('carePlan.objective')}
              body={carePlan.soapNotes.objective}
            />
            <CarePlanNoteBox
              title={t('carePlan.assessment')}
              items={carePlan.soapNotes.assessment}
            />
            <CarePlanNoteBox title={t('carePlan.plan')} items={carePlan.soapNotes.plan} />
          </View>
        </CarePlanCollapsibleSection>

        <CarePlanCollapsibleSection title={t('carePlan.diagnoses')}>
          <View className="gap-4">
            {carePlan.diagnoses.map((diagnosis) => (
              <CarePlanDiagnosisRow
                key={diagnosis.id}
                diagnosis={diagnosis}
                primaryLabel={t('carePlan.primary')}
                secondaryLabel={t('carePlan.secondary')}
                icdLabel={t('carePlan.icd10')}
              />
            ))}
          </View>
        </CarePlanCollapsibleSection>

        <CarePlanCollapsibleSection title={t('carePlan.recommendedTest')}>
          <View className="gap-4">
            {carePlan.recommendedTests.map((test) => (
              <CarePlanRecommendedTestRow key={test.id} test={test} />
            ))}
          </View>
        </CarePlanCollapsibleSection>

        <CarePlanCollapsibleSection title={t('carePlan.prescription')}>
          <View className="gap-6">
            {carePlan.prescriptions.map((prescription) => (
              <CarePlanPrescriptionItem key={prescription.id} prescription={prescription} />
            ))}
          </View>
        </CarePlanCollapsibleSection>
      </ScrollView>
    </SafeAreaView>
  );
}
