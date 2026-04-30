import { ActivityIndicator, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { primitiveColors } from '@design/tokens';
import { Button } from '@shared/components/ui/Button';
import { usePatientHistory } from '../hooks/usePatientHistory';
import { PatientHistoryCategoryCard } from '../components/profile/PatientHistoryCategoryCard';
import { PatientHistoryEditModal } from '../components/profile/PatientHistoryEditModal';
import { ProfileHeader } from '../components/profile/ProfileHeader';

export interface PatientHistoryViewProps {
  onBack: () => void;
}

export function PatientHistoryView({ onBack }: PatientHistoryViewProps) {
  const { t } = useTranslation();
  const {
    status,
    categories,
    selectedCategoryTitle,
    isModalVisible,
    isRadioCategory,
    isCategoryEditing,
    editingRowIndex,
    draftRows,
    draftFamilyHistory,
    validationError,
    isSaving,
    retry,
    openCategoryModal,
    closeCategoryModal,
    enableCategoryEditing,
    enableRowEditing,
    updateRowValue,
    updateFamilyHistoryValue,
    addRow,
    deleteRow,
    saveCategory,
  } = usePatientHistory();

  const header = (
    <ProfileHeader
      title={t('profileOverview.patientHistory.screenTitle')}
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

  if (categories.length === 0) {
    return (
      <SafeAreaView className="flex-1 bg-white" edges={['top']}>
        {header}
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-b3 font-sans text-grey-600 text-center">
            {t('profileOverview.patientHistory.emptyCategory')}
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
          {t('profileOverview.patientHistory.screenTitle')}
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

      <PatientHistoryEditModal
        visible={isModalVisible}
        title={selectedCategoryTitle}
        closeLabel={t('profileOverview.patientHistory.closeEditModal')}
        saveLabel={t('profileOverview.save')}
        addMoreLabel={t('profileOverview.patientHistory.addMore')}
        editLabel={t('profileOverview.patientHistory.editRow')}
        deleteLabel={t('profileOverview.patientHistory.deleteRow')}
        yesLabel={t('patientProfile.yes')}
        noLabel={t('patientProfile.no')}
        isRadioCategory={isRadioCategory}
        isCategoryEditing={isCategoryEditing}
        editingRowIndex={editingRowIndex}
        rows={draftRows}
        familyHistoryValue={draftFamilyHistory}
        validationError={validationError ? t(validationError) : undefined}
        isSaving={isSaving}
        onClose={closeCategoryModal}
        onEnableCategoryEditing={enableCategoryEditing}
        onEnableRowEditing={enableRowEditing}
        onChangeRowValue={updateRowValue}
        onDeleteRow={deleteRow}
        onAddMore={addRow}
        onChangeFamilyHistory={updateFamilyHistoryValue}
        onSave={() => {
          void saveCategory();
        }}
      />
    </SafeAreaView>
  );
}
