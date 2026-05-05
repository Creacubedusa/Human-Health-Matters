import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { primitiveColors } from '@design/tokens';
import { Alert } from '@shared/components/ui/Alert';
import { Button } from '@shared/components/ui/Button';
import { Input } from '@shared/components/ui/Input';
import { HeaderBackButton } from '@shared/components/ui/HeaderBackButton';
import { useDoctorAddMultiPrescription } from '../hooks/useDoctorAddMultiPrescription';
import type { DoctorPrescriptionDraft } from '../types/doctor.types';

export interface DoctorAddPrescriptionViewProps {
  patientId: string;
  returnTo?: string;
}

export function DoctorAddPrescriptionView({ patientId, returnTo }: DoctorAddPrescriptionViewProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const { blocks, invalidBlocks, isSubmitting, addBlock, removeBlock, updateField, save } =
    useDoctorAddMultiPrescription(patientId, returnTo);

  function handleCancel() {
    if (returnTo === 'post-session-care-plan') {
      router.replace('/(doctor)/post-session-care-plan');
    } else {
      router.back();
    }
  }

  async function handleSave() {
    const ok = await save();
    if (!ok) return;
    if (returnTo === 'post-session-care-plan') {
      router.replace('/(doctor)/post-session-care-plan');
    } else {
      router.replace(`/(doctor)/patients/${patientId}` as never);
    }
  }

  const hasAnyError = Object.values(invalidBlocks).some(Boolean);

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      {/* Header */}
      <View className="bg-primary-50 h-[66px] justify-end">
        <View className="flex-row items-center justify-between px-4 pb-3 h-[48px]">
          <HeaderBackButton onPress={handleCancel} accessibilityLabel={t('common.back')} />
          <Text className="text-[16px] font-semibold font-sans text-grey-900 absolute left-0 right-0 text-center pointer-events-none">
            {t('addPrescription.headerTitle')}
          </Text>
          <View className="w-[29px]" />
        </View>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerClassName="px-4 pt-6 pb-40 gap-4"
        showsVerticalScrollIndicator={false}
      >
        {/* Section title */}
        <Text className="text-[18px] font-semibold font-sans text-grey-900">
          {t('addPrescription.sectionTitle')}
        </Text>

        {/* Validation error banner */}
        {hasAnyError ? (
          <Alert
            status="error"
            variant="outline"
            description={t('addPrescription.errorRequired')}
          />
        ) : null}

        {/* Prescription blocks */}
        {blocks.map((block, index) => (
          <PrescriptionBlock
            key={index}
            block={block}
            index={index}
            isInvalid={!!invalidBlocks[index]}
            canRemove={blocks.length > 1}
            onRemove={() => removeBlock(index)}
            onChangeField={(field, value) => updateField(index, field, value)}
          />
        ))}

        {/* Add More button */}
        <View className="items-end">
          <Button
            label={t('addPrescription.addMoreBtn')}
            variant="outline"
            size="medium"
            onPress={addBlock}
          />
        </View>
      </ScrollView>

      {/* Footer */}
      <View className="absolute bottom-0 left-0 right-0 bg-white px-6 py-6 flex-row items-center justify-between">
        <Button
          label={t('addPrescription.cancelBtn')}
          variant="outline"
          size="large"
          onPress={handleCancel}
          disabled={isSubmitting}
        />
        <Button
          label={t('addPrescription.saveBtn')}
          variant="filled"
          size="large"
          onPress={() => void handleSave()}
          disabled={isSubmitting}
        />
      </View>
    </SafeAreaView>
  );
}

// ── Prescription block ────────────────────────────────────────────────────────

interface PrescriptionBlockProps {
  block: DoctorPrescriptionDraft;
  index: number;
  isInvalid: boolean;
  canRemove: boolean;
  onRemove: () => void;
  onChangeField: (field: keyof DoctorPrescriptionDraft, value: string) => void;
}

function PrescriptionBlock({
  block,
  index,
  isInvalid,
  canRemove,
  onRemove,
  onChangeField,
}: PrescriptionBlockProps) {
  const { t } = useTranslation();
  const n = index + 1;

  return (
    <View
      className={[
        'gap-4 rounded-2xl border p-4',
        isInvalid ? 'border-red-400' : 'border-grey-200',
      ].join(' ')}
    >
      {/* Block header with optional remove button */}
      {canRemove ? (
        <View className="flex-row items-center justify-between">
          <Text className="text-[16px] font-semibold font-sans text-grey-900">
            {`${t('addPrescription.sectionTitle')} ${n}`}
          </Text>
          <Ionicons
            name="close-circle-outline"
            size={22}
            color={primitiveColors['grey-500']}
            onPress={onRemove}
            accessibilityRole="button"
            accessibilityLabel={t('addPrescription.removeBlockLabel')}
          />
        </View>
      ) : null}

      <Input
        label={`${t('addPrescription.medicationLabel')} ${n}`}
        placeholder={t('addPrescription.placeholderMedication')}
        value={block.medication}
        onChangeText={(v) => onChangeField('medication', v)}
        status={isInvalid && !block.medication.trim() ? 'error' : 'default'}
      />

      <Input
        label={`${t('addPrescription.brandNameLabel')} ${n}`}
        placeholder={t('addPrescription.placeholderBrandName')}
        value={block.brandName}
        onChangeText={(v) => onChangeField('brandName', v)}
      />

      <Input
        label={`${t('addPrescription.doseLabel')} ${n}`}
        placeholder={t('addPrescription.placeholderDose')}
        value={block.dose}
        onChangeText={(v) => onChangeField('dose', v)}
        status={isInvalid && !block.dose.trim() ? 'error' : 'default'}
      />

      <Input
        label={`${t('addPrescription.frequencyLabel')} ${n}`}
        placeholder={t('addPrescription.placeholderFrequency')}
        value={block.frequency}
        onChangeText={(v) => onChangeField('frequency', v)}
        status={isInvalid && !block.frequency.trim() ? 'error' : 'default'}
      />

      <Input
        label={`${t('addPrescription.durationLabel')} ${n}`}
        placeholder={t('addPrescription.placeholderDuration')}
        value={block.duration}
        onChangeText={(v) => onChangeField('duration', v)}
        status={isInvalid && !block.duration.trim() ? 'error' : 'default'}
      />

      <Input
        label={`${t('addPrescription.routeLabel')} ${n}`}
        placeholder={t('addPrescription.placeholderRoute')}
        value={block.route}
        onChangeText={(v) => onChangeField('route', v)}
        status={isInvalid && !block.route.trim() ? 'error' : 'default'}
      />

      <Input
        label={`${t('addPrescription.refillLabel')} ${n}`}
        placeholder={t('addPrescription.placeholderRefill')}
        value={block.refillsLeft}
        keyboardType="number-pad"
        onChangeText={(v) => onChangeField('refillsLeft', v)}
      />

      <Input
        label={t('addPrescription.noteLabel')}
        placeholder={t('addPrescription.placeholderNote')}
        value={block.notes}
        multiline
        numberOfLines={4}
        onChangeText={(v) => onChangeField('notes', v)}
      />
    </View>
  );
}
