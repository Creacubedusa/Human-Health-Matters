import { ActivityIndicator, FlatList, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { primitiveColors } from '@design/tokens';
import { Alert } from '@shared/components/ui/Alert';
import { Button } from '@shared/components/ui/Button';
import { Input } from '@shared/components/ui/Input';
import { SelectInput } from '@shared/components/ui/SelectInput';
import { HeaderBackButton } from '@shared/components/ui/HeaderBackButton';
import { DoctorPatientCard } from '../components/patients/DoctorPatientCard';
import { DoctorPatientEmptyState } from '../components/patients/DoctorPatientEmptyState';
import { useDoctorCreateOrderWizard, type CreateOrderStep } from '../hooks/useDoctorCreateOrderWizard';
import type { DoctorPatientListItem } from '../types/doctor.types';

export interface DoctorCreateOrderWizardViewProps {
  preselectedPatientId?: string;
  onBack: () => void;
  onSuccess: () => void;
}

// ── Step indicator ────────────────────────────────────────────────────────────

const STEP_LABELS_KEYS = [
  'createOrderWizard.stepPatient',
  'createOrderWizard.stepOrderInfo',
  'createOrderWizard.stepTestInfo',
] as const;

function StepIndicator({ currentStep }: { currentStep: CreateOrderStep }) {
  const { t } = useTranslation();
  return (
    <View className="py-6 px-4 bg-white gap-3">
      <View className="flex-row items-center justify-center">
        {([1, 2, 3] as CreateOrderStep[]).map((n, idx) => (
          <View key={n} className="flex-row items-center">
            <View
              className={[
                'w-10 h-10 rounded-full items-center justify-center',
                n <= currentStep ? 'bg-primary-500' : 'bg-grey-200',
              ].join(' ')}
            >
              <Text
                className={[
                  'text-[18px] font-semibold font-sans',
                  n <= currentStep ? 'text-white' : 'text-grey-400',
                ].join(' ')}
              >
                {n}
              </Text>
            </View>
            {idx < 2 && <View className="w-[90px] h-[1px] bg-grey-300" />}
          </View>
        ))}
      </View>
      <View className="flex-row justify-between px-1">
        {STEP_LABELS_KEYS.map((key, idx) => (
          <Text
            key={key}
            className={[
              'text-[10px] font-medium font-sans text-center w-20',
              idx + 1 <= currentStep ? 'text-grey-900' : 'text-grey-400',
            ].join(' ')}
          >
            {t(key)}
          </Text>
        ))}
      </View>
    </View>
  );
}

// ── Main view ─────────────────────────────────────────────────────────────────

export function DoctorCreateOrderWizardView({
  preselectedPatientId,
  onBack,
  onSuccess,
}: DoctorCreateOrderWizardViewProps) {
  const { t } = useTranslation();
  const {
    patientsStatus,
    patientQuery,
    setPatientQuery,
    patients,
    step,
    selectedPatient,
    setSelectedPatient,
    orderInfo,
    setOrderInfo,
    testInfo,
    setTestInfo,
    errors,
    isSubmitting,
    isSuccess,
    goToStep2,
    goToStep3,
    goBack,
    submitOrder,
  } = useDoctorCreateOrderWizard(preselectedPatientId);

  const handleBack = step > 1 ? goBack : onBack;

  const testTypeOptions = [
    { label: t('createOrderWizard.testTypeLab'), value: 'lab' },
    { label: t('createOrderWizard.testTypeImaging'), value: 'imaging' },
  ];

  const priorityOptions = [
    { label: t('createOrderWizard.priorityUrgent'), value: 'urgent' },
    { label: t('createOrderWizard.priorityNotUrgent'), value: 'not-urgent' },
  ];

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      {/* Header */}
      <View className="bg-primary-50 h-[66px] justify-end">
        <View className="flex-row items-center justify-between px-4 pb-3 h-[48px]">
          <HeaderBackButton onPress={handleBack} accessibilityLabel={t('common.back')} />
          <Text className="text-[16px] font-semibold font-sans text-grey-900 absolute left-0 right-0 text-center pointer-events-none">
            {t('createOrderWizard.headerTitle')}
          </Text>
          <View className="w-[29px]" />
        </View>
      </View>

      <StepIndicator currentStep={step} />

      {/* ── Step 1: Patient Selection ──────────────────────────────────────── */}
      {step === 1 ? (
        <View className="flex-1">
          <View className="px-4 pt-4 pb-2">
            <Input
              placeholder={t('createOrderWizard.searchPlaceholder')}
              value={patientQuery}
              onChangeText={setPatientQuery}
              iconLeft={
                <Ionicons name="search" size={20} color={primitiveColors['grey-400']} />
              }
            />
            {errors.patient ? (
              <Text className="text-[13px] font-sans text-red-500 mt-2">
                {t(errors.patient)}
              </Text>
            ) : null}
          </View>

          {patientsStatus === 'loading' ? (
            <View className="flex-1 items-center justify-center">
              <ActivityIndicator size="large" color={primitiveColors['primary-500']} />
            </View>
          ) : (
            <FlatList
              data={patients}
              keyExtractor={(p: DoctorPatientListItem) => p.id}
              contentContainerClassName="px-4 pb-28 gap-3"
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={
                <DoctorPatientEmptyState searching={patientQuery.trim().length > 0} />
              }
              renderItem={({ item }: { item: DoctorPatientListItem }) => (
                <View
                  className={[
                    'rounded-2xl',
                    selectedPatient?.id === item.id
                      ? 'border-2 border-primary-500'
                      : 'border-2 border-transparent',
                  ].join(' ')}
                >
                  <DoctorPatientCard
                    patient={item}
                    onViewPatient={() => setSelectedPatient(item)}
                    showSummary={false}
                  />
                </View>
              )}
            />
          )}

          <View className="absolute bottom-0 left-0 right-0 bg-white px-4 py-6">
            <Button
              label={t('createOrderWizard.nextBtn')}
              variant="filled"
              size="large"
              fullWidth
              disabled={!selectedPatient}
              onPress={goToStep2}
            />
          </View>
        </View>
      ) : null}

      {/* ── Step 2: Order Information ──────────────────────────────────────── */}
      {step === 2 ? (
        <View className="flex-1">
          <ScrollView
            className="flex-1"
            contentContainerClassName="px-4 pt-4 pb-32 gap-4"
            showsVerticalScrollIndicator={false}
          >
            <Alert
              status="info"
              variant="outline"
              title={t('createOrderWizard.orderInfoBannerTitle')}
              description={t('createOrderWizard.orderInfoBannerBody', {
                name: selectedPatient?.name ?? '',
              })}
            />

            <Input
              label={`${t('createOrderWizard.physicianLabel')} *`}
              placeholder={t('createOrderWizard.physicianPlaceholder')}
              value={orderInfo.physician}
              onChangeText={(v) => setOrderInfo({ ...orderInfo, physician: v })}
              status={errors.physician ? 'error' : 'default'}
              helperText={errors.physician ? t(errors.physician) : undefined}
            />

            <Input
              label={`${t('createOrderWizard.specializationLabel')} *`}
              placeholder={t('createOrderWizard.specializationPlaceholder')}
              value={orderInfo.specialization}
              onChangeText={(v) => setOrderInfo({ ...orderInfo, specialization: v })}
              status={errors.specialization ? 'error' : 'default'}
              helperText={errors.specialization ? t(errors.specialization) : undefined}
            />

            <Input
              label={t('createOrderWizard.additionalCommentLabel')}
              placeholder={t('createOrderWizard.additionalCommentPlaceholder')}
              value={orderInfo.additionalComment}
              onChangeText={(v) => setOrderInfo({ ...orderInfo, additionalComment: v })}
              multiline
              numberOfLines={4}
            />
          </ScrollView>

          <View className="absolute bottom-0 left-0 right-0 bg-white px-4 py-6">
            <Button
              label={t('createOrderWizard.continueBtn')}
              variant="filled"
              size="large"
              fullWidth
              onPress={goToStep3}
            />
          </View>
        </View>
      ) : null}

      {/* ── Step 3: Test Information ───────────────────────────────────────── */}
      {step === 3 ? (
        <View className="flex-1">
          <ScrollView
            className="flex-1"
            contentContainerClassName="px-4 pt-4 pb-32 gap-4"
            showsVerticalScrollIndicator={false}
          >
            <Alert
              status="info"
              variant="outline"
              title={t('createOrderWizard.testInfoBannerTitle')}
              description={t('createOrderWizard.testInfoBannerBody', {
                name: selectedPatient?.name ?? '',
              })}
            />

            <SelectInput
              label={`${t('createOrderWizard.testTypeLabel')} *`}
              options={testTypeOptions}
              value={testInfo.testType}
              onChange={(v) => setTestInfo({ ...testInfo, testType: v })}
            />

            <Input
              label={`${t('createOrderWizard.testNameLabel')} *`}
              placeholder={t('createOrderWizard.testNamePlaceholder')}
              value={testInfo.testName}
              onChangeText={(v) => setTestInfo({ ...testInfo, testName: v })}
              status={errors.testName ? 'error' : 'default'}
              helperText={errors.testName ? t(errors.testName) : undefined}
            />

            <Input
              label={`${t('createOrderWizard.collectionInstructionLabel')} *`}
              placeholder={t('createOrderWizard.collectionInstructionPlaceholder')}
              value={testInfo.collectionInstruction}
              onChangeText={(v) => setTestInfo({ ...testInfo, collectionInstruction: v })}
              status={errors.collectionInstruction ? 'error' : 'default'}
              helperText={errors.collectionInstruction ? t(errors.collectionInstruction) : undefined}
            />

            <SelectInput
              label={`${t('createOrderWizard.priorityLabel')} *`}
              options={priorityOptions}
              value={testInfo.priority}
              onChange={(v) => setTestInfo({ ...testInfo, priority: v })}
            />

            <Input
              label={t('createOrderWizard.additionalCommentLabel')}
              placeholder={t('createOrderWizard.additionalCommentPlaceholder')}
              value={testInfo.additionalComment}
              onChangeText={(v) => setTestInfo({ ...testInfo, additionalComment: v })}
              multiline
              numberOfLines={4}
            />
          </ScrollView>

          <View className="absolute bottom-0 left-0 right-0 bg-white px-4 py-6">
            <Button
              label={t('createOrderWizard.submitBtn')}
              variant="filled"
              size="large"
              fullWidth
              disabled={isSubmitting}
              onPress={() => void submitOrder()}
            />
          </View>
        </View>
      ) : null}

      {/* ── Order Success Modal ──────────────────────────────────────────────── */}
      {isSuccess ? (
        <View className="absolute inset-0 z-50 items-center justify-center bg-black/50 px-6">
          <View className="bg-white rounded-lg border border-grey-200 w-full overflow-hidden">
            {/* Close */}
            <View className="flex-row items-center justify-end px-4 pt-4">
              <Ionicons
                name="close"
                size={20}
                color={primitiveColors['grey-400']}
                onPress={onSuccess}
                accessibilityRole="button"
                accessibilityLabel={t('common.dismiss')}
              />
            </View>

            {/* Body */}
            <View className="items-center px-6 py-5 gap-4">
              <MaterialCommunityIcons
                name="check-decagram"
                size={50}
                color={primitiveColors['primary-500']}
              />
              <Text className="text-[16px] font-sans text-grey-900 text-center leading-6">
                {t('createOrderWizard.successMessagePrefix')}
                <Text className="font-medium">{selectedPatient?.name ?? ''}</Text>
              </Text>
            </View>

            {/* Footer */}
            <View className="items-center pb-6">
              <View className="w-[127px]">
                <Button
                  label={t('createOrderWizard.viewOrderBtn')}
                  variant="filled"
                  size="small"
                  fullWidth
                  onPress={onSuccess}
                />
              </View>
            </View>
          </View>
        </View>
      ) : null}
    </SafeAreaView>
  );
}
