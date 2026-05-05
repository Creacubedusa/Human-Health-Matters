import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { primitiveColors } from '@design/tokens';
import { uploadImageToCloudinary } from '@shared/api/cloudinary';
import { AvatarUpload } from '@shared/components/ui/AvatarUpload';
import { Button } from '@shared/components/ui/Button';
import { Input } from '@shared/components/ui/Input';
import { SelectInput } from '@shared/components/ui/SelectInput';
import type { ProfileEditErrors } from '../hooks/usePatientProfileOverview';
import { usePatientProfileOverview } from '../hooks/usePatientProfileOverview';
import type { ProfileOverviewForm } from '../types/profileOverview.types';
import { ProfileHeader } from '../components/profile/ProfileHeader';

export interface PatientProfileEditViewProps {
  onBack: () => void;
  onSaveComplete: () => void;
}

export function PatientProfileEditView({ onBack, onSaveComplete }: PatientProfileEditViewProps) {
  const { t } = useTranslation();
  const { status, editForm, validateEditForm, saveProfile, retry } = usePatientProfileOverview();
  const [form, setForm] = useState<ProfileOverviewForm | null>(editForm);
  const [errors, setErrors] = useState<ProfileEditErrors>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (editForm) setForm(editForm);
  }, [editForm]);

  const header = (
    <ProfileHeader
      title={t('profileOverview.editProfileTitle')}
      backLabel={t('common.back')}
      onBack={onBack}
    />
  );

  if (status === 'loading' || !form) {
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
        <View className="flex-1 items-center justify-center px-4 gap-4">
          <Button
            label={t('common.retry')}
            onPress={retry}
            variant="outline"
            size="large"
          />
        </View>
      </SafeAreaView>
    );
  }

  const update = <K extends keyof ProfileOverviewForm>(field: K, value: ProfileOverviewForm[K]) => {
    setForm((prev) => (prev ? { ...prev, [field]: value } : prev));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  async function handleSave() {
    if (!form) return;

    const validationErrors = validateEditForm(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setSaving(true);

    try {
      const avatarUri =
        form.avatarUri && form.avatarUri.startsWith('file:')
          ? (
            await uploadImageToCloudinary({
              uri: form.avatarUri,
              filename: `avatar_${Date.now()}.jpg`,
            })
          ).secureUrl
          : form.avatarUri;

      await saveProfile({ ...form, avatarUri });
      onSaveComplete();
    } catch {
      Alert.alert('Save failed', 'Could not update your profile. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  const calendarIcon = (
    <Ionicons name="calendar-outline" size={20} color={primitiveColors['grey-400']} />
  );

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      {header}
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={120}
      >
        <ScrollView
          className="flex-1"
          contentContainerClassName="px-4 pt-6 pb-36 gap-5"
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <AvatarUpload
            uri={form.avatarUri}
            initials={form.name.slice(0, 1)}
            onSelect={(uri) => update('avatarUri', uri)}
          />

          <Input
            label={t('profileOverview.fullName')}
            value={form.name}
            onChangeText={(value) => update('name', value)}
            status={errors.name ? 'error' : 'default'}
            helperText={errors.name ? t(errors.name) : undefined}
          />

          <SelectInput
            label={t('profileOverview.gender')}
            value={form.gender.toLowerCase()}
            onChange={(value) => update('gender', value === 'female' ? 'Female' : value === 'male' ? 'Male' : 'Other')}
            options={[
              { label: t('profileOverview.genderFemale'), value: 'female' },
              { label: t('profileOverview.genderMale'), value: 'male' },
              { label: t('profileOverview.genderOther'), value: 'other' },
            ]}
            status={errors.gender ? 'error' : 'default'}
            helperText={errors.gender ? t(errors.gender) : undefined}
          />

          <Input
            label={t('profileOverview.height')}
            value={form.height}
            onChangeText={(value) => update('height', value)}
            status={errors.height ? 'error' : 'default'}
            helperText={errors.height ? t(errors.height) : undefined}
          />

          <Input
            label={t('profileOverview.weight')}
            value={form.weight}
            onChangeText={(value) => update('weight', value)}
            status={errors.weight ? 'error' : 'default'}
            helperText={errors.weight ? t(errors.weight) : undefined}
          />

          <Input
            label={t('profileOverview.dateOfBirth')}
            value={form.dateOfBirth}
            onChangeText={(value) => update('dateOfBirth', value)}
            placeholder={t('profileOverview.dobPlaceholder')}
            iconLeft={calendarIcon}
            status={errors.dateOfBirth ? 'error' : 'default'}
            helperText={errors.dateOfBirth ? t(errors.dateOfBirth) : undefined}
          />
        </ScrollView>

        <View className="absolute bottom-0 left-0 right-0 bg-white h-[112px] px-4 pt-8">
          <Button
            label={saving ? '' : t('profileOverview.saveChanges')}
            onPress={() => {
              void handleSave();
            }}
            fullWidth
            size="large"
            disabled={saving}
            iconLeft={saving ? <ActivityIndicator size="small" color="#ffffff" /> : undefined}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
