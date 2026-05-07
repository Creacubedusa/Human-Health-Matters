import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { usePatientStore } from '../store/patient.store';
import type { MedicationCategoryId } from '../types/medication.types';
import { getEffectiveMedicationSource, getMedicationCategorySummary } from '../utils/medication';
import { usePatientProfileOverview } from './usePatientProfileOverview';

interface MedicationCategoryCardData {
  id: MedicationCategoryId;
  title: string;
  summary: string;
}

interface MedicationCategoryConfig {
  cardTitleKey: string;
  modalTitleKey: string;
}

const CATEGORY_CONFIG: Record<MedicationCategoryId, MedicationCategoryConfig> = {
  medicationTypes: {
    cardTitleKey: 'profileOverview.medication.type',
    modalTitleKey: 'profileOverview.medication.typeModalTitle',
  },
  currentMedications: {
    cardTitleKey: 'profileOverview.medication.currentMedications',
    modalTitleKey: 'profileOverview.medication.currentMedicationModalTitle',
  },
};

export interface UsePatientMedicationResult {
  status: 'loading' | 'error' | 'empty' | 'success';
  categories: MedicationCategoryCardData[];
  selectedCategory: MedicationCategoryId | null;
  selectedCategoryTitle: string;
  isModalVisible: boolean;
  editingRowIndex: number | null;
  draftRows: string[];
  validationError: string | null;
  isSaving: boolean;
  retry: () => void;
  openCategoryModal: (category: MedicationCategoryId) => void;
  closeCategoryModal: () => void;
  enableRowEditing: (index: number) => void;
  updateRowValue: (index: number, value: string) => void;
  addRow: () => void;
  deleteRow: (index: number) => void;
  saveCategory: () => Promise<boolean>;
}

export function usePatientMedication(): UsePatientMedicationResult {
  const { t } = useTranslation();
  const { status, retry } = usePatientProfileOverview();
  const {
    profile,
    setupProfile,
    updateProfileMedication,
  } = usePatientStore();

  const sourceProfile = useMemo(
    () => getEffectiveMedicationSource(profile ?? setupProfile),
    [profile, setupProfile],
  );

  const [selectedCategory, setSelectedCategory] = useState<MedicationCategoryId | null>(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [editingRowIndex, setEditingRowIndex] = useState<number | null>(null);
  const [draftRows, setDraftRows] = useState<string[]>([]);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const categories = useMemo<MedicationCategoryCardData[]>(() => ([
    {
      id: 'medicationTypes',
      title: t(CATEGORY_CONFIG.medicationTypes.cardTitleKey),
      summary: getMedicationCategorySummary('medicationTypes', sourceProfile),
    },
    {
      id: 'currentMedications',
      title: t(CATEGORY_CONFIG.currentMedications.cardTitleKey),
      summary: getMedicationCategorySummary('currentMedications', sourceProfile),
    },
  ]), [sourceProfile, t]);

  const resetModalState = useCallback(() => {
    setSelectedCategory(null);
    setModalVisible(false);
    setEditingRowIndex(null);
    setDraftRows([]);
    setValidationError(null);
    setIsSaving(false);
  }, []);

  const openCategoryModal = useCallback((category: MedicationCategoryId) => {
    setSelectedCategory(category);
    setDraftRows([...sourceProfile[category]]);
    setEditingRowIndex(null);
    setValidationError(null);
    setIsSaving(false);
    setModalVisible(true);
  }, [sourceProfile]);

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

  const addRow = useCallback(() => {
    setDraftRows((prev) => [...prev, '']);
    setEditingRowIndex(draftRows.length);
    setValidationError(null);
  }, [draftRows.length]);

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

    const normalizedRows = draftRows.map((row) => row.trim());
    if (normalizedRows.some((row) => row.length === 0)) {
      setValidationError('profileOverview.medication.rowRequired');
      return false;
    }

    const seen = new Set<string>();
    const hasDuplicate = normalizedRows.some((row) => {
      const normalizedKey = row.toLocaleLowerCase();
      if (seen.has(normalizedKey)) return true;
      seen.add(normalizedKey);
      return false;
    });

    if (hasDuplicate) {
      setValidationError('profileOverview.medication.duplicateRow');
      return false;
    }

    setIsSaving(true);

    try {
      updateProfileMedication({
        [selectedCategory]: normalizedRows,
      });
      resetModalState();
      return true;
    } finally {
      setIsSaving(false);
    }
  }, [
    draftRows,
    isSaving,
    resetModalState,
    selectedCategory,
    updateProfileMedication,
  ]);

  return {
    status,
    categories,
    selectedCategory,
    selectedCategoryTitle: selectedCategory ? t(CATEGORY_CONFIG[selectedCategory].modalTitleKey) : '',
    isModalVisible,
    editingRowIndex,
    draftRows,
    validationError,
    isSaving,
    retry,
    openCategoryModal,
    closeCategoryModal: resetModalState,
    enableRowEditing,
    updateRowValue,
    addRow,
    deleteRow,
    saveCategory,
  };
}
