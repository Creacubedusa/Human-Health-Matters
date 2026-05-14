import { useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Alert } from '@shared/components/ui/Alert';
import { Button } from '@shared/components/ui/Button';
import { Input } from '@shared/components/ui/Input';
import { UploadInput } from '@shared/components/ui/UploadInput';
import { ProfileHeader } from '@features/patient/components/profile/ProfileHeader';
import { useDoctorPatientsStore } from '../store/doctorPatients.store';
import type { DoctorReportDraft } from '../types/doctor.types';

export interface DoctorAddDocumentViewProps {
  patientId: string;
}

const INITIAL_FORM: DoctorReportDraft = {
  title: '',
  category: '',
  fileUri: null,
};

export function DoctorAddDocumentView({ patientId }: DoctorAddDocumentViewProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const addReport = useDoctorPatientsStore((state) => state.addReport);
  const [form, setForm] = useState<DoctorReportDraft>(INITIAL_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [errorKey, setErrorKey] = useState<string | null>(null);

  function updateField<K extends keyof DoctorReportDraft>(key: K, value: DoctorReportDraft[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function handleSubmit() {
    if (!form.title.trim() || !form.category.trim() || !form.fileUri) {
      setErrorKey('doctorPatients.errors.requiredFields');
      return;
    }

    setErrorKey(null);
    setSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 300));
    addReport(patientId, form);
    router.replace(`/(doctor)/patients/${patientId}`);
  }

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      <ProfileHeader
        title={t('doctorPatients.addDocumentTitle')}
        backLabel={t('common.back')}
        onBack={() => router.back()}
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
            label={t('doctorPatients.form.documentTitle')}
            value={form.title}
            onChangeText={(value) => updateField('title', value)}
          />
          <Input
            label={t('doctorPatients.form.documentCategory')}
            value={form.category}
            onChangeText={(value) => updateField('category', value)}
          />
          <UploadInput
            label={t('doctorPatients.form.documentFile')}
            value={form.fileUri}
            onChange={(uri) => updateField('fileUri', uri)}
            placeholder={t('doctorPatients.form.documentUploadPlaceholder')}
            loadingLabel={t('doctorPatients.form.uploading')}
          />
        </ScrollView>
      </KeyboardAvoidingView>

      <View className="absolute bottom-0 left-0 right-0 bg-white px-4 py-6 border-t border-grey-100">
        <Button
          label={submitting ? '' : t('doctorPatients.saveDocument')}
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
