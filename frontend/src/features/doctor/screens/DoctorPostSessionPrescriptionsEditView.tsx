import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { primitiveColors } from '@design/tokens';
import { Button } from '@shared/components/ui/Button';
import { HeaderBackButton } from '@shared/components/ui/HeaderBackButton';
import type { DoctorPostSessionPrescriptionDraft } from '../types/doctorConsultation.types';

interface DoctorPostSessionPrescriptionsEditViewProps {
  prescriptions: DoctorPostSessionPrescriptionDraft[];
  onSave: (prescriptions: DoctorPostSessionPrescriptionDraft[]) => void;
  onCancel: () => void;
}

function makeId() {
  return `prescription-${Math.random().toString(36).slice(2, 9)}`;
}

function createBlankPrescription(): DoctorPostSessionPrescriptionDraft {
  return {
    id: makeId(),
    medication: '',
    brandName: '',
    dose: '',
    frequency: '',
    duration: '',
    route: '',
    refillsLeft: '',
    notes: '',
  };
}

function PrescriptionInput({
  label,
  value,
  onChangeText,
  tall = false,
}: {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  tall?: boolean;
}) {
  return (
    <View className="gap-2">
      <Text className="text-[16px] font-medium font-sans leading-6 text-grey-900">{label}</Text>
      <View
        className={[
          'rounded-[12px] border border-grey-200 bg-grey-50 px-4 py-3',
          tall ? 'min-h-[112px]' : 'min-h-[54px]',
        ].join(' ')}
      >
        <TextInput
          value={value}
          onChangeText={onChangeText}
          multiline={tall}
          textAlignVertical={tall ? 'top' : 'center'}
          className="text-[16px] font-sans leading-6 text-grey-900"
          placeholder=""
          placeholderTextColor={primitiveColors['grey-400']}
        />
      </View>
    </View>
  );
}

export function DoctorPostSessionPrescriptionsEditView({
  prescriptions,
  onSave,
  onCancel,
}: DoctorPostSessionPrescriptionsEditViewProps) {
  const { t } = useTranslation();
  const [draft, setDraft] = useState<DoctorPostSessionPrescriptionDraft[]>(
    prescriptions.length > 0 ? prescriptions : [createBlankPrescription()],
  );

  function updatePrescription(
    id: string,
    field: keyof Omit<DoctorPostSessionPrescriptionDraft, 'id'>,
    value: string,
  ) {
    setDraft((current) =>
      current.map((prescription) =>
        prescription.id !== id
          ? prescription
          : {
            ...prescription,
            [field]: value,
          },
      ),
    );
  }

  function addMore() {
    setDraft((current) => [...current, createBlankPrescription()]);
  }

  function removePrescription(id: string) {
    setDraft((current) =>
      current.length > 1 ? current.filter((prescription) => prescription.id !== id) : current,
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top', 'bottom']}>
      <View className="bg-primary-50">
        <View className="h-[66px] flex-row items-center justify-between px-4">
          <HeaderBackButton onPress={onCancel} accessibilityLabel={t('common.back')} />
          <Text className="text-[16px] font-semibold font-sans text-grey-900">Prescription</Text>
          <View className="h-[29px] w-[29px]" />
        </View>
      </View>

      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          className="flex-1 bg-white"
          contentContainerClassName="px-3 pb-32 pt-3"
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View className="gap-4">
            <Text className="text-[18px] font-semibold font-sans leading-7 text-grey-900">
              Prescription
            </Text>

            {draft.map((prescription, index) => (
              <View key={prescription.id} className="gap-4">
                <View className="flex-row items-center justify-between">
                  <Text className="text-[16px] font-medium font-sans text-grey-900">
                    Prescription {index + 1}
                  </Text>
                  {draft.length > 1 ? (
                    <Pressable
                      onPress={() => removePrescription(prescription.id)}
                      className="h-6 w-6 items-center justify-center"
                    >
                      <Ionicons name="trash-outline" size={18} color={primitiveColors['red-500']} />
                    </Pressable>
                  ) : null}
                </View>

                <PrescriptionInput
                  label={`Medication name ${index + 1}`}
                  value={prescription.medication}
                  onChangeText={(value) => updatePrescription(prescription.id, 'medication', value)}
                />
                <PrescriptionInput
                  label={`Brand name ${index + 1}`}
                  value={prescription.brandName}
                  onChangeText={(value) => updatePrescription(prescription.id, 'brandName', value)}
                />
                <PrescriptionInput
                  label={`Dose ${index + 1}`}
                  value={prescription.dose}
                  onChangeText={(value) => updatePrescription(prescription.id, 'dose', value)}
                />
                <PrescriptionInput
                  label={`Frequency ${index + 1}`}
                  value={prescription.frequency}
                  onChangeText={(value) => updatePrescription(prescription.id, 'frequency', value)}
                />
                <PrescriptionInput
                  label={`Duration ${index + 1}`}
                  value={prescription.duration}
                  onChangeText={(value) => updatePrescription(prescription.id, 'duration', value)}
                />
                <PrescriptionInput
                  label={`Route ${index + 1}`}
                  value={prescription.route}
                  onChangeText={(value) => updatePrescription(prescription.id, 'route', value)}
                />
                <PrescriptionInput
                  label={`Refill ${index + 1}`}
                  value={prescription.refillsLeft}
                  onChangeText={(value) => updatePrescription(prescription.id, 'refillsLeft', value)}
                />
                <PrescriptionInput
                  label={`Note ${index + 1}`}
                  value={prescription.notes}
                  onChangeText={(value) => updatePrescription(prescription.id, 'notes', value)}
                  tall
                />
              </View>
            ))}

            <Pressable
              onPress={addMore}
              className="h-10 self-end items-center justify-center rounded-[12px] border border-grey-300 px-4"
            >
              <Text className="text-[14px] font-semibold font-sans text-grey-900">Add More</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <View className="absolute bottom-0 left-0 right-0 bg-white px-6 pb-6 pt-4">
        <View className="flex-row items-center justify-between">
          <Button
            label="Cancel"
            variant="outline"
            size="large"
            onPress={onCancel}
            testID="prescriptions-edit-cancel"
          />
          <Button
            label="Save"
            size="large"
            onPress={() => onSave(draft)}
            testID="prescriptions-edit-save"
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
