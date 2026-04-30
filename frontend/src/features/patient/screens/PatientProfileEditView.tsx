<<<<<<< HEAD:src/features/patient/screens/PatientProfileEditView.tsx
import { useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
=======
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, KeyboardAvoidingView, Platform, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
>>>>>>> 290025c34b3930e6341a697d4a0c37e6f2562012:frontend/src/features/patient/screens/PatientProfileEditView.tsx
import { primitiveColors } from '@design/tokens';
import { AvatarUpload } from '@shared/components/ui/AvatarUpload';
import { Button } from '@shared/components/ui/Button';
import { Input } from '@shared/components/ui/Input';
import { SelectInput } from '@shared/components/ui/SelectInput';
import { usePatientProfileOverview } from '../hooks/usePatientProfileOverview';
<<<<<<< HEAD:src/features/patient/screens/PatientProfileEditView.tsx
import type { ProfileEditErrors } from '../hooks/usePatientProfileOverview';
import type { ProfileOverviewForm } from '../types/profileOverview.types';
import { ProfileHeader } from '../components/profile/ProfileHeader';
=======
import type { ProfileOverviewForm } from '../types/profileOverview.types';
import { ProfileHeader } from '../components/profile/ProfileHeader';
import { uploadImageToCloudinary } from '@shared/api/cloudinary';
>>>>>>> 290025c34b3930e6341a697d4a0c37e6f2562012:frontend/src/features/patient/screens/PatientProfileEditView.tsx

export interface PatientProfileEditViewProps {
  onBack: () => void;
  onSaveComplete: () => void;
}

export function PatientProfileEditView({ onBack, onSaveComplete }: PatientProfileEditViewProps) {
  const { t } = useTranslation();
<<<<<<< HEAD:src/features/patient/screens/PatientProfileEditView.tsx
  const { status, editForm, validateEditForm, saveProfile, retry } = usePatientProfileOverview();
  const [form, setForm] = useState<ProfileOverviewForm | null>(editForm);
  const [errors, setErrors] = useState<ProfileEditErrors>({});
=======
  const { status, editForm, saveProfile } = usePatientProfileOverview();
  const [form, setForm] = useState<ProfileOverviewForm | null>(editForm);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (editForm) setForm(editForm);
  }, [editForm]);
>>>>>>> 290025c34b3930e6341a697d4a0c37e6f2562012:frontend/src/features/patient/screens/PatientProfileEditView.tsx

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

<<<<<<< HEAD:src/features/patient/screens/PatientProfileEditView.tsx
  if (status === 'error') {
    return (
      <SafeAreaView className="flex-1 bg-white" edges={['top']}>
        {header}
        <View className="flex-1 items-center justify-center px-4 gap-4">
          <Input
            value={t('profileOverview.errorMessage')}
            disabled
          />
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
    setForm((prev) => prev ? { ...prev, [field]: value } : prev);
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  function handleSave() {
    if (!form) return;
    const validationErrors = validateEditForm(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    saveProfile(form);
    onSaveComplete();
  }

  const calendarIcon = (
    <Ionicons name="calendar-outline" size={20} color={primitiveColors['grey-400']} />
  );
=======
  const update = <K extends keyof ProfileOverviewForm>(field: K, value: ProfileOverviewForm[K]) => {
    setForm((prev) => prev ? { ...prev, [field]: value } : prev);
  };

  async function handleSave() {
    if (!form) return;
    setSaving(true);
    try {
      const avatarUri =
        form.avatarUri && form.avatarUri.startsWith('file:')
          ? (await uploadImageToCloudinary({ uri: form.avatarUri, filename: `avatar_${Date.now()}.jpg` })).secureUrl
          : form.avatarUri;

      await saveProfile({ ...form, avatarUri });
      onSaveComplete();
    } catch (e) {
      Alert.alert('Upload failed', 'Could not upload your profile picture. Please try again.');
    } finally {
      setSaving(false);
    }
  }
>>>>>>> 290025c34b3930e6341a697d4a0c37e6f2562012:frontend/src/features/patient/screens/PatientProfileEditView.tsx

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
<<<<<<< HEAD:src/features/patient/screens/PatientProfileEditView.tsx
            label={t('profileOverview.fullName')}
            value={form.name}
            onChangeText={(value) => update('name', value)}
            status={errors.name ? 'error' : 'default'}
            helperText={errors.name ? t(errors.name) : undefined}
          />

=======
            label={t('profileOverview.name')}
            value={form.name}
            onChangeText={(value) => update('name', value)}
          />
>>>>>>> 290025c34b3930e6341a697d4a0c37e6f2562012:frontend/src/features/patient/screens/PatientProfileEditView.tsx
          <SelectInput
            label={t('profileOverview.gender')}
            value={form.gender.toLowerCase()}
            onChange={(value) => update('gender', value === 'female' ? 'Female' : value === 'male' ? 'Male' : 'Other')}
            options={[
              { label: t('profileOverview.genderFemale'), value: 'female' },
              { label: t('profileOverview.genderMale'), value: 'male' },
              { label: t('profileOverview.genderOther'), value: 'other' },
            ]}
<<<<<<< HEAD:src/features/patient/screens/PatientProfileEditView.tsx
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
=======
          />
          <Input label={t('profileOverview.height')} value={form.height} onChangeText={(value) => update('height', value)} />
          <Input label={t('profileOverview.weight')} value={form.weight} onChangeText={(value) => update('weight', value)} />
          <Input label={t('profileOverview.age')} value={form.age} onChangeText={(value) => update('age', value)} />
          <Input label={t('profileOverview.phone')} value={form.phone} onChangeText={(value) => update('phone', value)} keyboardType="phone-pad" />
          <Input label={t('profileOverview.email')} value={form.email} onChangeText={(value) => update('email', value)} keyboardType="email-address" autoCapitalize="none" />
          <Input label={t('profileOverview.address')} value={form.address} onChangeText={(value) => update('address', value)} />
          <Input label={t('profileOverview.nationality')} value={form.nationality} onChangeText={(value) => update('nationality', value)} />
          <SelectInput
            label={t('profileOverview.language')}
            value={form.selectedLanguage}
            onChange={(value) => update('selectedLanguage', value)}
            options={[
              { label: 'English', value: 'en' },
              { label: 'Spanish', value: 'es' },
            ]}
>>>>>>> 290025c34b3930e6341a697d4a0c37e6f2562012:frontend/src/features/patient/screens/PatientProfileEditView.tsx
          />
        </ScrollView>

        <View className="absolute bottom-0 left-0 right-0 bg-white h-[112px] px-4 pt-8">
<<<<<<< HEAD:src/features/patient/screens/PatientProfileEditView.tsx
          <Button label={t('profileOverview.saveChanges')} onPress={handleSave} fullWidth size="large" />
=======
          <Button
            label={saving ? '' : t('profileOverview.saveChanges')}
            onPress={handleSave}
            fullWidth
            size="large"
            disabled={saving}
            iconLeft={saving ? <ActivityIndicator size="small" color="#ffffff" /> : undefined}
          />
>>>>>>> 290025c34b3930e6341a697d4a0c37e6f2562012:frontend/src/features/patient/screens/PatientProfileEditView.tsx
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
