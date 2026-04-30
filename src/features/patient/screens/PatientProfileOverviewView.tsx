import { useEffect, useMemo, useRef } from 'react';
import { ActivityIndicator, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { primitiveColors } from '@design/tokens';
import { Button } from '@shared/components/ui/Button';
import { usePatientProfileOverview } from '../hooks/usePatientProfileOverview';
import type { ProfileDetailItem, ProfileRecordId } from '../types/profileOverview.types';
import { HealthcareSupportCard } from '../components/profile/HealthcareSupportCard';
import { ProfileDetailEditModal } from '../components/profile/ProfileDetailEditModal';
import { MedicalRecordsSection } from '../components/profile/MedicalRecordsSection';
import { ProfileCard } from '../components/profile/ProfileCard';
import { ProfileDetailsSection } from '../components/profile/ProfileDetailsSection';
import { ProfileHeader } from '../components/profile/ProfileHeader';
import { ProfileSetupModal } from '../components/profile/ProfileSetupModal';
import { SettingsSection } from '../components/profile/SettingsSection';

export interface PatientProfileOverviewViewProps {
  onBack?: () => void;
  onEdit: () => void;
  onCompleteProfile: () => void;
  onLanguage: () => void;
  onPrivacy: () => void;
  onRecord: (id: ProfileRecordId | 'support-report') => void;
}

export function PatientProfileOverviewView({
  onBack,
  onEdit,
  onCompleteProfile,
  onLanguage,
  onPrivacy,
  onRecord,
}: PatientProfileOverviewViewProps) {
  const { t } = useTranslation();
  const {
    status,
    profile,
    isSetupModalVisible,
    selectedField,
    isDetailModalVisible,
    isEditingDetail,
    detailFieldValue,
    detailValidationError,
    isSavingDetail,
    dismissSetupModal,
    openDetailModal,
    closeDetailModal,
    enableDetailEditing,
    updateDetailValue,
    saveDetailValue,
    setNotificationEnabled,
    retry,
  } = usePatientProfileOverview();
  const detailInputRef = useRef<TextInput>(null);

  useEffect(() => {
    if (!isDetailModalVisible || !isEditingDetail) return;

    const timeoutId = setTimeout(() => detailInputRef.current?.focus(), 50);
    return () => clearTimeout(timeoutId);
  }, [isDetailModalVisible, isEditingDetail]);

  const detailKeyboardTypes: Record<ProfileDetailItem['id'], 'default' | 'phone-pad' | 'email-address'> = {
    phone: 'phone-pad',
    email: 'email-address',
    address: 'default',
    nationality: 'default',
  };

  const detailTitle = useMemo(() => {
    if (!selectedField) return '';
    return t(`profileOverview.${selectedField}`);
  }, [selectedField, t]);

  const header = (
    <ProfileHeader
      title={t('profileOverview.headerTitle')}
      backLabel={t('common.back')}
      onBack={onBack}
    />
  );

  if (status === 'loading') {
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
        <View className="flex-1 items-center justify-center px-6 gap-4">
          <Text className="text-b3 font-sans text-grey-700 text-center">
            {t('profileOverview.errorMessage')}
          </Text>
          <Button label={t('common.retry')} onPress={retry} size="medium" />
        </View>
      </SafeAreaView>
    );
  }

  if (!profile) {
    return (
      <SafeAreaView className="flex-1 bg-white" edges={['top']}>
        {header}
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-b3 font-sans text-grey-600 text-center">
            {t('profileOverview.emptyMessage')}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      {header}

      <ScrollView
        className="flex-1"
        contentContainerClassName="px-4 pt-8 pb-28 gap-6"
        showsVerticalScrollIndicator={false}
      >
        <ProfileCard
          profile={profile}
          labels={{
            height: t('profileOverview.height'),
            weight: t('profileOverview.weight'),
            age: t('profileOverview.age'),
            edit: t('profileOverview.edit'),
          }}
          onEdit={onEdit}
        />

        {isSetupModalVisible && (
          <ProfileSetupModal
            title={t('profileOverview.setupTitle')}
            description={t('profileOverview.setupDescription')}
            cancelLabel={t('profileOverview.cancel')}
            continueLabel={t('profileOverview.continue')}
            closeLabel={t('profileOverview.close')}
            onCancel={dismissSetupModal}
            onContinue={onCompleteProfile}
          />
        )}

        <ProfileDetailsSection
          title={t('profileOverview.personalDetails')}
          profile={profile}
          labels={{
            phone: t('profileOverview.phone'),
            email: t('profileOverview.email'),
            address: t('profileOverview.address'),
            nationality: t('profileOverview.nationality'),
          }}
          onEdit={openDetailModal}
        />

        <ProfileDetailEditModal
          visible={isDetailModalVisible}
          title={detailTitle}
          value={detailFieldValue}
          saveLabel={t('profileOverview.save')}
          closeLabel={t('profileOverview.closeDetailEdit')}
          editLabel={t('profileOverview.editField')}
          keyboardType={selectedField ? detailKeyboardTypes[selectedField] : 'default'}
          isEditing={isEditingDetail}
          isSaving={isSavingDetail}
          error={detailValidationError ? t(detailValidationError) : undefined}
          inputRef={detailInputRef}
          onChangeValue={updateDetailValue}
          onEnableEditing={enableDetailEditing}
          onClose={closeDetailModal}
          onSave={() => {
            void saveDetailValue();
          }}
        />

        <HealthcareSupportCard
          support={profile.healthcareSupport}
          onPress={() => onRecord('support-report')}
        />

        <MedicalRecordsSection
          title={t('profileOverview.medicalRecords')}
          records={profile.medicalRecords}
          onRecordPress={onRecord}
        />

        <SettingsSection
          title={t('profileOverview.settings')}
          notificationLabel={t('profileOverview.notification')}
          languageLabel={t('profileOverview.language')}
          privacyLabel={t('profileOverview.privacyPolicy')}
          notificationEnabled={profile.notificationEnabled}
          onNotificationChange={setNotificationEnabled}
          onLanguagePress={onLanguage}
          onPrivacyPress={onPrivacy}
        />
      </ScrollView>
    </SafeAreaView>
  );
}
