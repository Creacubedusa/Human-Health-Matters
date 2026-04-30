import { ActivityIndicator, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { primitiveColors } from '@design/tokens';
import { Button } from '@shared/components/ui/Button';
import { PatientHistoryCategoryCard } from '../components/profile/PatientHistoryCategoryCard';
import { ProfileEditableListModal } from '../components/profile/ProfileEditableListModal';
import { ProfileHeader } from '../components/profile/ProfileHeader';
import { usePatientMedication } from '../hooks/usePatientMedication';

export interface MedicationViewProps {
  onBack: () => void;
}

export function MedicationView({ onBack }: MedicationViewProps) {
  const { t } = useTranslation();
  const {
    status,
    categories,
    selectedCategoryTitle,
    isModalVisible,
    editingRowIndex,
    draftRows,
    validationError,
    isSaving,
    retry,
    openCategoryModal,
    closeCategoryModal,
    enableRowEditing,
    updateRowValue,
    addRow,
    deleteRow,
    saveCategory,
  } = usePatientMedication();

  const header = (
    <ProfileHeader
      title={t('profileOverview.medication.screenTitle')}
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
        <View className="flex-1 items-center justify-center gap-4 px-6">
          <Text className="text-b3 font-sans text-grey-700 text-center">
            {t('profileOverview.errorMessage')}
          </Text>
          <Button label={t('common.retry')} onPress={retry} size="medium" />
        </View>
      </SafeAreaView>
    );
  }

  if (categories.length === 0) {
    return (
      <SafeAreaView className="flex-1 bg-white" edges={['top']}>
        {header}
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-b3 font-sans text-grey-600 text-center">
            {t('profileOverview.medication.emptyCategory')}
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
        contentContainerClassName="px-4 pt-8 pb-10 gap-6"
        showsVerticalScrollIndicator={false}
      >
        <Text className="text-h5 font-semibold font-sans text-grey-900">
          {t('profileOverview.medication.screenTitle')}
        </Text>

        <View className="gap-5">
          {categories.map((category) => (
            <PatientHistoryCategoryCard
              key={category.id}
              title={category.title}
              summary={category.summary}
              onPress={() => openCategoryModal(category.id)}
            />
          ))}
        </View>
      </ScrollView>

      <ProfileEditableListModal
        visible={isModalVisible}
        title={selectedCategoryTitle}
        closeLabel={t('profileOverview.medication.closeEditModal')}
        saveLabel={t('profileOverview.save')}
        addMoreLabel={t('profileOverview.medication.addMore')}
        editLabel={t('profileOverview.medication.editRow')}
        deleteLabel={t('profileOverview.medication.deleteRow')}
        rows={draftRows}
        editingRowIndex={editingRowIndex}
        validationError={validationError ? t(validationError) : undefined}
        isSaving={isSaving}
        onClose={closeCategoryModal}
        onEnableRowEditing={enableRowEditing}
        onChangeRowValue={updateRowValue}
        onDeleteRow={deleteRow}
        onAddMore={addRow}
        onSave={() => {
          void saveCategory();
        }}
      />
    </SafeAreaView>
  );
}
