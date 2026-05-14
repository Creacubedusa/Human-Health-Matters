import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { primitiveColors } from '@design/tokens';
import { Button } from '@shared/components/ui/Button';
import { HeaderBackButton } from '@shared/components/ui/HeaderBackButton';
import type { DoctorPostSessionDiagnosisDraft } from '../types/doctorConsultation.types';

interface DoctorPostSessionDiagnosesEditViewProps {
  diagnoses: DoctorPostSessionDiagnosisDraft[];
  onSave: (diagnoses: DoctorPostSessionDiagnosisDraft[]) => void;
  onCancel: () => void;
}

function makeId() {
  return `diagnosis-${Math.random().toString(36).slice(2, 9)}`;
}

function createBlankDiagnosis(): DoctorPostSessionDiagnosisDraft {
  return {
    id: makeId(),
    name: '',
    icd10Code: '',
    priority: 'primary',
  };
}

function DiagnosisInput({
  label,
  value,
  onChangeText,
}: {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
}) {
  return (
    <View className="gap-2">
      <Text className="text-[16px] font-medium font-sans leading-6 text-grey-900">{label}</Text>
      <View className="rounded-[12px] border border-grey-200 bg-grey-50 px-4 py-3">
        <TextInput
          value={value}
          onChangeText={onChangeText}
          className="text-[16px] font-sans leading-6 text-grey-900"
          placeholder=""
          placeholderTextColor={primitiveColors['grey-400']}
        />
      </View>
    </View>
  );
}

export function DoctorPostSessionDiagnosesEditView({
  diagnoses,
  onSave,
  onCancel,
}: DoctorPostSessionDiagnosesEditViewProps) {
  const { t } = useTranslation();
  const [draft, setDraft] = useState<DoctorPostSessionDiagnosisDraft[]>(
    diagnoses.length > 0 ? diagnoses : [createBlankDiagnosis()],
  );

  function updateDiagnosis(
    id: string,
    field: keyof Omit<DoctorPostSessionDiagnosisDraft, 'id'>,
    value: string,
  ) {
    setDraft((current) =>
      current.map((diagnosis) =>
        diagnosis.id !== id
          ? diagnosis
          : {
            ...diagnosis,
            [field]: value,
          },
      ),
    );
  }

  function addMore() {
    setDraft((current) => [...current, createBlankDiagnosis()]);
  }

  function removeDiagnosis(id: string) {
    setDraft((current) => (current.length > 1 ? current.filter((item) => item.id !== id) : current));
  }

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top', 'bottom']}>
      <View className="bg-primary-50">
        <View className="h-[66px] flex-row items-center justify-between px-4">
          <HeaderBackButton onPress={onCancel} accessibilityLabel={t('common.back')} />
          <Text className="text-[16px] font-semibold font-sans text-grey-900">Diagnoses</Text>
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
              Diagnoses
            </Text>

            {draft.map((diagnosis, index) => (
              <View key={diagnosis.id} className="gap-4">
                <View className="flex-row items-center justify-between">
                  <Text className="text-[16px] font-medium font-sans text-grey-900">
                    Diagnosis {index + 1}
                  </Text>
                  {draft.length > 1 ? (
                    <Pressable
                      onPress={() => removeDiagnosis(diagnosis.id)}
                      className="h-6 w-6 items-center justify-center"
                    >
                      <Ionicons name="trash-outline" size={18} color={primitiveColors['red-500']} />
                    </Pressable>
                  ) : null}
                </View>

                <DiagnosisInput
                  label={`Diagnose ${index + 1}`}
                  value={diagnosis.name}
                  onChangeText={(value) => updateDiagnosis(diagnosis.id, 'name', value)}
                />
                <DiagnosisInput
                  label={`Diagnosis code ${index + 1}`}
                  value={diagnosis.icd10Code}
                  onChangeText={(value) => updateDiagnosis(diagnosis.id, 'icd10Code', value)}
                />

                <View className="gap-2">
                  <Text className="text-[16px] font-medium font-sans leading-6 text-grey-900">
                    Classification {index + 1}
                  </Text>
                  <View className="rounded-[12px] border border-grey-200 bg-grey-50 px-4 py-3">
                    <View className="flex-row items-center justify-between">
                      <View className="flex-row gap-2">
                        {(['primary', 'secondary'] as const).map((priority) => {
                          const active = diagnosis.priority === priority;
                          return (
                            <Pressable
                              key={priority}
                              onPress={() => updateDiagnosis(diagnosis.id, 'priority', priority)}
                              className={[
                                'rounded-[10px] px-3 py-2',
                                active ? 'bg-white border border-primary-500' : 'bg-transparent border border-transparent',
                              ].join(' ')}
                            >
                              <Text
                                className={[
                                  'text-[16px] font-sans leading-6',
                                  active ? 'text-primary-500' : 'text-grey-400',
                                ].join(' ')}
                              >
                                {priority === 'primary' ? 'Primary' : 'Secondary'}
                              </Text>
                            </Pressable>
                          );
                        })}
                      </View>
                      <Ionicons name="chevron-down" size={20} color={primitiveColors['grey-400']} />
                    </View>
                  </View>
                </View>
              </View>
            ))}

            <Pressable
              onPress={addMore}
              className="h-10 self-end rounded-[12px] border border-grey-300 px-4 items-center justify-center"
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
            testID="diagnoses-edit-cancel"
          />
          <Button
            label="Save"
            size="large"
            onPress={() => onSave(draft)}
            testID="diagnoses-edit-save"
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
