import { useEffect, useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { primitiveColors } from '@design/tokens';
import { AvatarUpload } from '@shared/components/ui/AvatarUpload';
import { Button } from '@shared/components/ui/Button';
import { Input } from '@shared/components/ui/Input';
import { SelectInput } from '@shared/components/ui/SelectInput';
import { usePatientProfileOverview } from '../hooks/usePatientProfileOverview';
import type { ProfileOverviewForm } from '../types/profileOverview.types';
import { ProfileHeader } from '../components/profile/ProfileHeader';

export interface PatientProfileEditViewProps {
  onBack: () => void;
  onSaveComplete: () => void;
}

export function PatientProfileEditView({ onBack, onSaveComplete }: PatientProfileEditViewProps) {
  const { t } = useTranslation();
  const { status, editForm, saveProfile } = usePatientProfileOverview();
  const [form, setForm] = useState<ProfileOverviewForm | null>(editForm);

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

  const update = <K extends keyof ProfileOverviewForm>(field: K, value: ProfileOverviewForm[K]) => {
    setForm((prev) => prev ? { ...prev, [field]: value } : prev);
  };

  function handleSave() {
    if (!form) return;
    saveProfile(form);
    onSaveComplete();
  }

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
            label={t('profileOverview.name')}
            value={form.name}
            onChangeText={(value) => update('name', value)}
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
          />
        </ScrollView>

        <View className="absolute bottom-0 left-0 right-0 bg-white h-[112px] px-4 pt-8">
          <Button label={t('profileOverview.saveChanges')} onPress={handleSave} fullWidth size="large" />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
