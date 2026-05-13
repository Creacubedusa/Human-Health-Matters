import { useMemo } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { primitiveColors } from '@design/tokens';
import { Button } from '@shared/components/ui/Button';
import { HeaderBackButton } from '@shared/components/ui/HeaderBackButton';
import type {
  DoctorPostSessionCarePlanDraft,
  SoapNote,
} from '../types/doctorConsultation.types';

interface DoctorPostSessionCarePlanViewProps {
  draft: DoctorPostSessionCarePlanDraft;
  submitting: boolean;
  onBack: () => void;
  onApprove: () => void;
  onUpdateSoap: (field: keyof SoapNote, value: string) => void;
  onEditSoap: () => void;
  onEditDiagnoses: () => void;
  onEditRecommendedTests: () => void;
  onEditPrescriptions: () => void;
  onOrderTest: () => void;
  onAddPrescription: () => void;
}

function SectionCard({ children }: { children: React.ReactNode }) {
  return <View className="rounded-[8px] border border-grey-300 bg-white px-4 py-4">{children}</View>;
}

function SectionHeader({
  title,
  editable,
  editing,
  onToggle,
}: {
  title: string;
  editable: boolean;
  editing: boolean;
  onToggle: () => void;
}) {
  return (
    <View className="flex-row items-center justify-between">
      <Text className="text-[16px] font-medium font-sans leading-6 text-[#212121]">{title}</Text>
      {editable ? (
        <Pressable
          onPress={onToggle}
          className="h-6 w-6 items-center justify-center"
          accessibilityRole="button"
          accessibilityLabel={editing ? `Close ${title} editing` : `Edit ${title}`}
        >
          <Ionicons
            name={editing ? 'checkmark' : 'create-outline'}
            size={18}
            color={primitiveColors['grey-900']}
          />
        </Pressable>
      ) : null}
    </View>
  );
}

function SoapInputField({
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
        className={`rounded-[8px] border border-grey-200 bg-grey-50 px-4 py-3 ${tall ? 'min-h-[136px]' : 'min-h-[54px]'}`}
      >
        <TextInput
          multiline={tall}
          value={value}
          onChangeText={onChangeText}
          editable
          scrollEnabled={false}
          textAlignVertical={tall ? 'top' : 'center'}
          className="text-[14px] font-sans leading-5 text-grey-900"
          placeholder=""
        />
      </View>
    </View>
  );
}

function DiagnosisBadge({ priority }: { priority: 'primary' | 'secondary' }) {
  const active = priority === 'primary';
  return (
    <View className="rounded-[8px] bg-white px-4 py-[6px]">
      <Text className={`text-[10px] font-semibold font-sans leading-3 ${active ? 'text-primary-500' : 'text-[#0095FF]'}`}>
        {active ? 'Primary' : 'Secondary'}
      </Text>
    </View>
  );
}

function EmptySpacer() {
  return <View className="h-[29px] w-[29px]" />;
}

export function DoctorPostSessionCarePlanView({
  draft,
  submitting,
  onBack,
  onApprove,
  onUpdateSoap,
  onEditSoap,
  onEditDiagnoses,
  onEditRecommendedTests,
  onEditPrescriptions,
  onOrderTest,
  onAddPrescription,
}: DoctorPostSessionCarePlanViewProps) {
  const { t } = useTranslation();

  const approveLabel = draft.isAiGenerated ? 'Approve' : 'Submit';
  const diagnosisCards = useMemo(
    () => draft.diagnoses.filter((item) => item.name.trim()),
    [draft.diagnoses],
  );
  const recommendedTests = useMemo(
    () => draft.recommendedTests.filter((item) => item.name.trim()),
    [draft.recommendedTests],
  );
  const prescriptions = useMemo(
    () => draft.prescriptions.filter((item) => item.medication.trim()),
    [draft.prescriptions],
  );

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top', 'bottom']}>
      <View className="h-[120px] bg-primary-50">
        <View className="mt-[47px] h-[66px] flex-row items-center justify-between px-4">
          <HeaderBackButton onPress={onBack} accessibilityLabel={t('common.back')} />
          <Text className="text-[16px] font-semibold font-sans text-grey-900">Care Plan</Text>
          <EmptySpacer />
        </View>
      </View>

      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          className="flex-1 bg-white"
          contentContainerClassName="gap-4 px-2 pb-32 pt-4"
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <SectionCard>
            <View className="gap-7">
              <View className="flex-row items-start justify-between">
                <View className="flex-row items-start gap-[15px]">
                  <View className="h-10 w-10 items-center justify-center rounded-full bg-[#F6D6D0]">
                    <Text className="text-[16px] font-semibold font-sans text-[#B55B47]">
                      {draft.patientInitials.slice(0, 1).toUpperCase()}
                    </Text>
                  </View>

                  <View className="w-[115px] gap-1">
                    <Text className="text-[16px] font-semibold font-sans leading-6 text-[#414042]">
                      {draft.patientName}
                    </Text>
                    <Text className="text-[12px] font-sans leading-4 text-grey-600">
                      {draft.patientGender}
                    </Text>
                  </View>
                </View>

                <View className="h-6 min-w-[65px] items-center justify-center rounded-[8px] bg-[#E6F4FF] px-3">
                  <Text className="text-[10px] font-semibold font-sans leading-3 text-[#0095FF]">
                    {draft.consultationType}
                  </Text>
                </View>
              </View>

              <View className="flex-row items-center justify-between">
                <View className="w-[80px] gap-1">
                  <Text className="text-[12px] font-sans leading-4 text-grey-600">Duration</Text>
                  <Text className="text-[14px] font-medium font-sans leading-5 text-grey-900">
                    {draft.duration}
                  </Text>
                </View>
                <View className="w-[80px] items-center gap-1">
                  <Text className="text-[12px] font-sans leading-4 text-grey-600">Session type</Text>
                  <Text className="text-[14px] font-medium font-sans leading-5 text-grey-900">
                    {draft.sessionType}
                  </Text>
                </View>
                <View className="w-[79px] items-center gap-1">
                  <Text className="text-[12px] font-sans leading-4 text-grey-600">Date</Text>
                  <Text className="text-[14px] font-medium font-sans leading-5 text-grey-900">
                    {draft.consultationDate}
                  </Text>
                </View>
              </View>
            </View>
          </SectionCard>

          {draft.isAiGenerated ? (
            <View className="rounded-[12px] bg-red-50 px-4 py-3">
              <Text className="text-center text-[12px] font-sans leading-4 text-grey-900">
                This is an AI-Generated Summary (Review Required)
              </Text>
            </View>
          ) : null}

          <SectionCard>
            <View className="gap-4">
              <SectionHeader
                title="SOAP notes"
                editable
                editing={false}
                onToggle={onEditSoap}
              />
              <View className="gap-4">
                <SoapInputField
                  label="Subjective"
                  value={draft.soap.subjective}
                  onChangeText={(value) => onUpdateSoap('subjective', value)}
                  tall
                />
                <SoapInputField
                  label="Objective"
                  value={draft.soap.objective}
                  onChangeText={(value) => onUpdateSoap('objective', value)}
                  tall
                />
                <SoapInputField
                  label="Assessment"
                  value={draft.soap.assessment}
                  onChangeText={(value) => onUpdateSoap('assessment', value)}
                  tall
                />
                <SoapInputField
                  label="Plan"
                  value={draft.soap.plan}
                  onChangeText={(value) => onUpdateSoap('plan', value)}
                  tall
                />
              </View>
            </View>
          </SectionCard>

          <SectionCard>
            <View className="gap-4">
              <SectionHeader
                title="Diagnoses"
                editable
                editing={false}
                onToggle={onEditDiagnoses}
              />
              <View className="gap-3">
                {diagnosisCards.map((diagnosis) => (
                  <View key={diagnosis.id} className="rounded-[8px] border border-primary-50 bg-primary-50 px-3 py-3">
                    <View className="flex-row items-start justify-between gap-3">
                      <View className="flex-1 gap-2">
                        <Text className="text-[14px] font-sans leading-5 text-grey-600">{diagnosis.name}</Text>
                        <Text className="text-[10px] font-medium font-sans leading-[14px] text-grey-900">
                          ICD-10: {diagnosis.icd10Code}
                        </Text>
                      </View>
                      <DiagnosisBadge priority={diagnosis.priority} />
                    </View>
                  </View>
                ))}
              </View>
            </View>
          </SectionCard>

          <SectionCard>
            <View className="gap-4">
              <SectionHeader
                title="Recommended test"
                editable
                editing={false}
                onToggle={onEditRecommendedTests}
              />
              <View className="gap-3">
                {recommendedTests.map((test) => (
                  <View key={test.id} className="rounded-[8px] border border-primary-50 bg-primary-50 px-3 py-4">
                    <Text className="text-[14px] font-sans leading-5 text-grey-900">{test.name}</Text>
                  </View>
                ))}
              </View>

              <View className="gap-3">
                <Text className="text-[16px] font-medium font-sans leading-6 text-grey-900">
                  Please, order test after writing the recommended test
                </Text>
                <Pressable
                  onPress={onOrderTest}
                  className="h-10 items-center justify-center rounded-[12px] border border-primary-500"
                >
                  <Text className="text-[14px] font-semibold font-sans text-primary-500">Order Test</Text>
                </Pressable>
              </View>
            </View>
          </SectionCard>

          <SectionCard>
            <View className="gap-4">
              <SectionHeader
                title="Prescription"
                editable
                editing={false}
                onToggle={onEditPrescriptions}
              />
              <View className="gap-4">
                {prescriptions.map((prescription) => (
                  <View key={prescription.id} className="gap-2">
                    <Text className="text-[14px] font-medium font-sans leading-5 text-grey-900">
                      {prescription.medication}
                    </Text>
                    <View className="gap-1">
                      {[
                        prescription.brandName && `Brand name: ${prescription.brandName}`,
                        prescription.dose && `Dose: ${prescription.dose}`,
                        prescription.frequency && `Frequency: ${prescription.frequency}`,
                        prescription.duration && `Duration: ${prescription.duration}`,
                        prescription.route && `Route: ${prescription.route}`,
                        prescription.refillsLeft && `Refills left: ${prescription.refillsLeft}`,
                        prescription.notes && `Notes: ${prescription.notes}`,
                      ]
                        .filter(Boolean)
                        .map((detail) => (
                          <View key={detail} className="flex-row items-start gap-2">
                            <Text className="text-[14px] font-sans leading-5 text-grey-600">{'\u2022'}</Text>
                            <Text className="flex-1 text-[14px] font-sans leading-5 text-grey-600">
                              {detail}
                            </Text>
                          </View>
                        ))}
                    </View>
                  </View>
                ))}
              </View>

              <Pressable
                onPress={onAddPrescription}
                className="h-8 w-[122px] items-center justify-center rounded-[8px] border border-primary-500"
              >
                <Text className="text-[12px] font-semibold font-sans text-primary-500">
                  Add Prescription
                </Text>
              </Pressable>
            </View>
          </SectionCard>
        </ScrollView>
      </KeyboardAvoidingView>

      <View className="absolute bottom-0 left-0 right-0 bg-white px-4 pb-8 pt-4">
        <Button
          label={submitting ? '' : approveLabel}
          onPress={onApprove}
          size="large"
          fullWidth
          disabled={submitting}
          iconLeft={submitting ? <ActivityIndicator size="small" color="#ffffff" /> : undefined}
        />
      </View>
    </SafeAreaView>
  );
}
