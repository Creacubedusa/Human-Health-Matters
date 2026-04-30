import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { usePatientStore } from '../store/patient.store';
import type { ProfileForm } from '../types/profile.types';
import type {
  PatientHistoryCategoryId,
  PatientHistoryListCategoryId,
} from '../types/patientHistory.types';
import { getEffectivePatientHistorySource } from '../utils/patientHistory';
import { usePatientProfileOverview } from './usePatientProfileOverview';

type FamilyHistoryValue = ProfileForm['familyHistoryDiabetes'];

interface PatientHistoryCategoryCardData {
  id: PatientHistoryCategoryId;
  title: string;
  summary: string;
}

interface PatientHistoryCategoryConfig {
  titleKey: string;
  type: 'list' | 'radio';
}

const CATEGORY_CONFIG: Record<PatientHistoryCategoryId, PatientHistoryCategoryConfig> = {
  chronicDiseases: {
    titleKey: 'profileOverview.patientHistory.chronicDiseases',
    type: 'list',
  },
  familyHistoryDiabetes: {
    titleKey: 'profileOverview.patientHistory.familyDiabetesHistory',
    type: 'radio',
  },
  generalFamilyHistory: {
    titleKey: 'profileOverview.patientHistory.generalFamilyHistory',
    type: 'list',
  },
  surgeries: {
    titleKey: 'profileOverview.patientHistory.operation',
    type: 'list',
  },
  allergies: {
    titleKey: 'profileOverview.patientHistory.allergies',
    type: 'list',
  },
};

export interface UsePatientHistoryResult {
  status: 'loading' | 'error' | 'empty' | 'success';
  categories: PatientHistoryCategoryCardData[];
  selectedCategory: PatientHistoryCategoryId | null;
  selectedCategoryTitle: string;
  isModalVisible: boolean;
  isRadioCategory: boolean;
  isCategoryEditing: boolean;
  editingRowIndex: number | null;
  draftRows: string[];
  draftFamilyHistory: FamilyHistoryValue;
  validationError: string | null;
  isSaving: boolean;
  retry: () => void;
  openCategoryModal: (category: PatientHistoryCategoryId) => void;
  closeCategoryModal: () => void;
  enableCategoryEditing: () => void;
  enableRowEditing: (index: number) => void;
  updateRowValue: (index: number, value: string) => void;
  updateFamilyHistoryValue: (value: FamilyHistoryValue) => void;
  addRow: () => void;
  deleteRow: (index: number) => void;
  saveCategory: () => Promise<boolean>;
}

function buildCategorySummary(
  category: PatientHistoryCategoryId,
  profile: ProfileForm,
  t: (key: string) => string,
): string {
  if (category === 'familyHistoryDiabetes') {
    if (profile.familyHistoryDiabetes === 'yes') return t('patientProfile.yes');
    if (profile.familyHistoryDiabetes === 'no') return t('patientProfile.no');
    if (profile.familyHistoryDiabetes === 'unknown') return t('patientProfile.unknown');
    return t('profileOverview.patientHistory.emptyCategory');
  }

  const values = profile[category]
    .map((value) => value.trim())
    .filter(Boolean);

  return values.length > 0
    ? values.join(', ')
    : t('profileOverview.patientHistory.emptyCategory');
}

export function usePatientHistory(): UsePatientHistoryResult {
  const { t } = useTranslation();
  const { status, retry } = usePatientProfileOverview();
  const {
    profile,
    setupProfile,
    updateProfileHistory,
  } = usePatientStore();

  const sourceProfile = useMemo(
    () => getEffectivePatientHistorySource(profile ?? setupProfile),
    [profile, setupProfile],
  );

  const [selectedCategory, setSelectedCategory] = useState<PatientHistoryCategoryId | null>(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [isCategoryEditing, setCategoryEditing] = useState(false);
  const [editingRowIndex, setEditingRowIndex] = useState<number | null>(null);
  const [draftRows, setDraftRows] = useState<string[]>([]);
  const [draftFamilyHistory, setDraftFamilyHistory] = useState<FamilyHistoryValue>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const categories = useMemo<PatientHistoryCategoryCardData[]>(() => ([
    {
      id: 'chronicDiseases',
      title: t(CATEGORY_CONFIG.chronicDiseases.titleKey),
      summary: buildCategorySummary('chronicDiseases', sourceProfile, t),
    },
    {
      id: 'familyHistoryDiabetes',
      title: t(CATEGORY_CONFIG.familyHistoryDiabetes.titleKey),
      summary: buildCategorySummary('familyHistoryDiabetes', sourceProfile, t),
    },
    {
      id: 'generalFamilyHistory',
      title: t(CATEGORY_CONFIG.generalFamilyHistory.titleKey),
      summary: buildCategorySummary('generalFamilyHistory', sourceProfile, t),
    },
    {
      id: 'surgeries',
      title: t(CATEGORY_CONFIG.surgeries.titleKey),
      summary: buildCategorySummary('surgeries', sourceProfile, t),
    },
    {
      id: 'allergies',
      title: t(CATEGORY_CONFIG.allergies.titleKey),
      summary: buildCategorySummary('allergies', sourceProfile, t),
    },
  ]), [sourceProfile, t]);

  const resetModalState = useCallback(() => {
    setSelectedCategory(null);
    setModalVisible(false);
    setCategoryEditing(false);
    setEditingRowIndex(null);
    setDraftRows([]);
    setDraftFamilyHistory(null);
    setValidationError(null);
    setIsSaving(false);
  }, []);

  const openCategoryModal = useCallback((category: PatientHistoryCategoryId) => {
    setSelectedCategory(category);
    setValidationError(null);
    setCategoryEditing(false);
    setEditingRowIndex(null);
    setIsSaving(false);

    if (category === 'familyHistoryDiabetes') {
      setDraftRows([]);
      setDraftFamilyHistory(sourceProfile.familyHistoryDiabetes);
    } else {
      setDraftRows([...sourceProfile[category]]);
      setDraftFamilyHistory(null);
    }

    setModalVisible(true);
  }, [sourceProfile]);

  const enableCategoryEditing = useCallback(() => {
    setCategoryEditing(true);
    setValidationError(null);
  }, []);

  const enableRowEditing = useCallback((index: number) => {
    setEditingRowIndex(index);
    setValidationError(null);
  }, []);

  const updateRowValue = useCallback((index: number, value: string) => {
    setDraftRows((prev) => prev.map((row, rowIndex) => (
      rowIndex === index ? value : row
    )));
    setValidationError(null);
  }, []);

  const updateFamilyHistoryValue = useCallback((value: FamilyHistoryValue) => {
    if (!isCategoryEditing) return;
    setDraftFamilyHistory(value);
    setValidationError(null);
  }, [isCategoryEditing]);

  const addRow = useCallback(() => {
    if (!selectedCategory || CATEGORY_CONFIG[selectedCategory].type !== 'list') return;

    setDraftRows((prev) => [...prev, '']);
    setEditingRowIndex(draftRows.length);
    setValidationError(null);
  }, [draftRows.length, selectedCategory]);

  const deleteRow = useCallback((index: number) => {
    setDraftRows((prev) => prev.filter((_, rowIndex) => rowIndex !== index));
    setEditingRowIndex((prev) => {
      if (prev == null) return prev;
      if (prev === index) return null;
      return prev > index ? prev - 1 : prev;
    });
    setValidationError(null);
  }, []);

  const saveCategory = useCallback(async () => {
    if (!selectedCategory || isSaving) return false;

    setIsSaving(true);

    try {
      if (selectedCategory === 'familyHistoryDiabetes') {
        if (isCategoryEditing && draftFamilyHistory !== 'yes' && draftFamilyHistory !== 'no') {
          setValidationError('profileOverview.patientHistory.familyHistoryRequired');
          return false;
        }

        if (draftFamilyHistory == null) {
          setValidationError('profileOverview.patientHistory.familyHistoryRequired');
          return false;
        }

        updateProfileHistory({ familyHistoryDiabetes: draftFamilyHistory });
        resetModalState();
        return true;
      }

      const normalizedRows = draftRows.map((row) => row.trim());
      if (normalizedRows.some((row) => row.length === 0)) {
        setValidationError('profileOverview.patientHistory.rowRequired');
        return false;
      }

      updateProfileHistory({
        [selectedCategory]: normalizedRows,
      } as Pick<ProfileForm, PatientHistoryListCategoryId>);
      resetModalState();
      return true;
    } finally {
      setIsSaving(false);
    }
  }, [
    draftFamilyHistory,
    draftRows,
    isCategoryEditing,
    isSaving,
    resetModalState,
    selectedCategory,
    updateProfileHistory,
  ]);

  return {
    status,
    categories,
    selectedCategory,
    selectedCategoryTitle: selectedCategory ? t(CATEGORY_CONFIG[selectedCategory].titleKey) : '',
    isModalVisible,
    isRadioCategory: selectedCategory === 'familyHistoryDiabetes',
    isCategoryEditing,
    editingRowIndex,
    draftRows,
    draftFamilyHistory,
    validationError,
    isSaving,
    retry,
    openCategoryModal,
    closeCategoryModal: resetModalState,
    enableCategoryEditing,
    enableRowEditing,
    updateRowValue,
    updateFamilyHistoryValue,
    addRow,
    deleteRow,
    saveCategory,
  };
}
