import { useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Alert } from '@shared/components/ui/Alert';
import { Button } from '@shared/components/ui/Button';
import { Input } from '@shared/components/ui/Input';
import { ProfileHeader } from '@features/patient/components/profile/ProfileHeader';
import { useDoctorPatientsStore } from '../store/doctorPatients.store';
import { useDoctorConsultationStore } from '../store/doctorConsultation.store';
import { createDoctorLabOrder } from '../services/doctor.service';
import type { DoctorOrderDraft } from '../types/doctor.types';

export interface DoctorCreateOrderViewProps {
  patientId: string;
  returnTo?: string;
}

const INITIAL_FORM: DoctorOrderDraft = {
  testName: '',
  priority: '',
  sampleType: '',
  collectionInstruction: '',
  additionalComment: '',
};

export function DoctorCreateOrderView({ patientId, returnTo }: DoctorCreateOrderViewProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const addOrder = useDoctorPatientsStore((state) => state.addOrder);
  const updateDraftTests = useDoctorConsultationStore((state) => ({
    add: state.addPostSessionRecommendedTest,
    update: state.updatePostSessionRecommendedTest,
    draft: state.postSessionDraft,
  }));
  const [form, setForm] = useState<DoctorOrderDraft>(INITIAL_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [errorKey, setErrorKey] = useState<string | null>(null);

  function updateField<K extends keyof DoctorOrderDraft>(key: K, value: DoctorOrderDraft[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function handleSubmit() {
    if (!form.testName.trim() || !form.priority.trim() || !form.sampleType.trim()) {
      setErrorKey('doctorPatients.errors.requiredFields');
      return;
    }

    setErrorKey(null);
    setSubmitting(true);
    try {
      await createDoctorLabOrder({
        patientId,
        testName: form.testName,
        testType: form.sampleType,
        priority: form.priority,
        sampleType: form.sampleType,
        collectionInstruction: form.collectionInstruction,
        additionalComment: form.additionalComment,
      });
    } catch (error) {
      setSubmitting(false);
      setErrorKey('doctorPatients.errors.saveFailed');
      return;
    }
    addOrder(patientId, form);
    if (returnTo === 'post-session-care-plan') {
      if (updateDraftTests.draft) {
        const blankTest = updateDraftTests.draft.recommendedTests.find((item) => !item.name.trim());
        if (blankTest) {
          updateDraftTests.update(blankTest.id, form.testName);
        } else {
          updateDraftTests.add();
          const latestDraft = useDoctorConsultationStore.getState().postSessionDraft;
          const latest = latestDraft?.recommendedTests[latestDraft.recommendedTests.length - 1];
          if (latest) {
            useDoctorConsultationStore.getState().updatePostSessionRecommendedTest(latest.id, form.testName);
          }
        }
      }
      router.replace('/(doctor)/post-session-care-plan');
      return;
    }
    router.replace(`/(doctor)/patients/${patientId}`);
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ProfileHeader
        title={t('doctorPatients.createOrderTitle')}
        backLabel={t('common.back')}
        onBack={() => {
          if (returnTo === 'post-session-care-plan') {
            router.replace('/(doctor)/post-session-care-plan');
            return;
          }
          router.back();
        }}
      />

      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          className="flex-1"
          contentContainerClassName="px-4 pt-6 pb-32 gap-4"
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {errorKey ? <Alert status="error" variant="outline" description={t(errorKey)} /> : null}

          <Input
            label={t('doctorPatients.form.testName')}
            value={form.testName}
            onChangeText={(value) => updateField('testName', value)}
          />
          <Input
            label={t('doctorPatients.form.priority')}
            value={form.priority}
            onChangeText={(value) => updateField('priority', value.toLowerCase())}
            placeholder={t('doctorPatients.form.priorityPlaceholder')}
          />
          <Input
            label={t('doctorPatients.form.sampleType')}
            value={form.sampleType}
            onChangeText={(value) => updateField('sampleType', value)}
          />
          <Input
            label={t('doctorPatients.form.collectionInstruction')}
            value={form.collectionInstruction}
            onChangeText={(value) => updateField('collectionInstruction', value)}
          />
          <Input
            label={t('doctorPatients.form.additionalComment')}
            value={form.additionalComment}
            multiline
            numberOfLines={4}
            onChangeText={(value) => updateField('additionalComment', value)}
          />
        </ScrollView>
      </KeyboardAvoidingView>

      <View className="absolute bottom-0 left-0 right-0 bg-white px-4 py-6 border-t border-grey-100">
        <Button
          label={submitting ? '' : t('doctorPatients.saveOrder')}
          onPress={handleSubmit}
          size="large"
          fullWidth
          disabled={submitting}
          iconLeft={submitting ? <ActivityIndicator size="small" color="#ffffff" /> : undefined}
        />
      </View>
    </SafeAreaView>
  );
}
