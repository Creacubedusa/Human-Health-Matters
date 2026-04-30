import { useCallback, useEffect, useMemo, useState } from 'react';
<<<<<<< HEAD:src/features/patient/hooks/usePatientProfileOverview.ts
import { fetchPatientProfileOverview } from '../services/profileOverview.service';
import { usePatientStore } from '../store/patient.store';
import type {
  PatientProfileOverview,
  ProfileDetailItem,
  ProfileOverviewForm,
  ProfileRecordId,
} from '../types/profileOverview.types';
import { syncMedicationMedicalRecord } from '../utils/medication';
import { syncPatientHistoryMedicalRecord } from '../utils/patientHistory';

type ProfileOverviewStatus = 'loading' | 'error' | 'empty' | 'success';

export type ProfileEditErrors = Partial<Record<keyof ProfileOverviewForm, string>>;
export type ProfileOverviewDetailField = ProfileDetailItem['id'];

interface DetailFieldConfig {
  emptyErrorKey: string;
  invalidErrorKey?: string;
  normalize: (value: string) => string;
  validate: (value: string) => boolean;
}

const PHONE_ALLOWED_PATTERN = /^[+\d\s\-()]+$/;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const DETAIL_FIELD_CONFIG: Record<ProfileOverviewDetailField, DetailFieldConfig> = {
  phone: {
    emptyErrorKey: 'profileOverview.detailEditErrors.phoneRequired',
    invalidErrorKey: 'profileOverview.detailEditErrors.phoneInvalid',
    normalize: (value) => value.trim().replace(/\s+/g, ' '),
    validate: (value) => {
      const trimmed = value.trim();
      const digits = trimmed.replace(/\D/g, '');
      return PHONE_ALLOWED_PATTERN.test(trimmed) && digits.length >= 7 && digits.length <= 15;
    },
  },
  email: {
    emptyErrorKey: 'profileOverview.detailEditErrors.emailRequired',
    invalidErrorKey: 'profileOverview.detailEditErrors.emailInvalid',
    normalize: (value) => value.trim(),
    validate: (value) => EMAIL_PATTERN.test(value.trim()),
  },
  address: {
    emptyErrorKey: 'profileOverview.detailEditErrors.addressRequired',
    normalize: (value) => value.trim(),
    validate: (value) => value.trim().length > 0,
  },
  nationality: {
    emptyErrorKey: 'profileOverview.detailEditErrors.nationalityRequired',
    normalize: (value) => value.trim(),
    validate: (value) => value.trim().length > 0,
  },
};

=======
import { fetchPatientProfileOverview, updatePatientProfileOverview } from '../services/profileOverview.service';
import { usePatientStore } from '../store/patient.store';
import type {
  PatientProfileOverview,
  ProfileOverviewForm,
  ProfileRecordId,
} from '../types/profileOverview.types';

type ProfileOverviewStatus = 'loading' | 'error' | 'empty' | 'success';

>>>>>>> 290025c34b3930e6341a697d4a0c37e6f2562012:frontend/src/features/patient/hooks/usePatientProfileOverview.ts
export interface UsePatientProfileOverviewResult {
  status: ProfileOverviewStatus;
  profile: PatientProfileOverview | null;
  isSetupModalVisible: boolean;
<<<<<<< HEAD:src/features/patient/hooks/usePatientProfileOverview.ts
  selectedField: ProfileOverviewDetailField | null;
  isDetailModalVisible: boolean;
  isEditingDetail: boolean;
  detailFieldValue: string;
  detailValidationError: string | null;
  isSavingDetail: boolean;
=======
>>>>>>> 290025c34b3930e6341a697d4a0c37e6f2562012:frontend/src/features/patient/hooks/usePatientProfileOverview.ts
  editForm: ProfileOverviewForm | null;
  selectedRecord: (id: ProfileRecordId) => PatientProfileOverview['medicalRecords'][number] | undefined;
  retry: () => void;
  dismissSetupModal: () => void;
<<<<<<< HEAD:src/features/patient/hooks/usePatientProfileOverview.ts
  openDetailModal: (field: ProfileOverviewDetailField) => void;
  closeDetailModal: () => void;
  enableDetailEditing: () => void;
  updateDetailValue: (value: string) => void;
  saveDetailValue: () => Promise<boolean>;
  setNotificationEnabled: (enabled: boolean) => void;
  setSelectedLanguage: (language: string) => void;
  validateEditForm: (form: ProfileOverviewForm) => ProfileEditErrors;
  saveProfile: (form: ProfileOverviewForm) => void;
}

function deriveAgeFromDob(dob: string): string {
  if (!dob) return '';
  // Accepts ISO (YYYY-MM-DD) or display (DD/MM/YYYY)
  let date: Date;
  if (dob.includes('/')) {
    const [day, month, year] = dob.split('/').map(Number);
    date = new Date(year, month - 1, day);
  } else {
    date = new Date(dob);
  }
  if (isNaN(date.getTime())) return '';
  const today = new Date();
  let age = today.getFullYear() - date.getFullYear();
  const hasBirthdayPassed =
    today.getMonth() > date.getMonth() ||
    (today.getMonth() === date.getMonth() && today.getDate() >= date.getDate());
  if (!hasBirthdayPassed) age -= 1;
  return age > 0 ? `${age} years` : '';
}

export function validateProfileEditForm(form: ProfileOverviewForm): ProfileEditErrors {
  const errors: ProfileEditErrors = {};
  if (!form.name.trim()) errors.name = 'profileOverview.editErrors.nameRequired';
  if (!form.gender) errors.gender = 'profileOverview.editErrors.genderRequired';
  if (!form.height.trim()) errors.height = 'profileOverview.editErrors.heightRequired';
  if (!form.weight.trim()) errors.weight = 'profileOverview.editErrors.weightRequired';
  if (!form.dateOfBirth.trim()) errors.dateOfBirth = 'profileOverview.editErrors.dobRequired';
  return errors;
=======
  setNotificationEnabled: (enabled: boolean) => void;
  setSelectedLanguage: (language: string) => void;
  saveProfile: (form: ProfileOverviewForm) => Promise<void>;
>>>>>>> 290025c34b3930e6341a697d4a0c37e6f2562012:frontend/src/features/patient/hooks/usePatientProfileOverview.ts
}

export function usePatientProfileOverview(): UsePatientProfileOverviewResult {
  const {
    profileOverview,
<<<<<<< HEAD:src/features/patient/hooks/usePatientProfileOverview.ts
    profile,
=======
>>>>>>> 290025c34b3930e6341a697d4a0c37e6f2562012:frontend/src/features/patient/hooks/usePatientProfileOverview.ts
    setupProfile,
    setProfileOverview,
    updateProfileOverview,
  } = usePatientStore();

  const [status, setStatus] = useState<ProfileOverviewStatus>(profileOverview ? 'success' : 'loading');
  const [isSetupModalVisible, setSetupModalVisible] = useState(false);
<<<<<<< HEAD:src/features/patient/hooks/usePatientProfileOverview.ts
  const [selectedField, setSelectedField] = useState<ProfileOverviewDetailField | null>(null);
  const [isDetailModalVisible, setDetailModalVisible] = useState(false);
  const [isEditingDetail, setIsEditingDetail] = useState(false);
  const [detailFieldValue, setDetailFieldValue] = useState('');
  const [detailValidationError, setDetailValidationError] = useState<string | null>(null);
  const [isSavingDetail, setIsSavingDetail] = useState(false);
=======
>>>>>>> 290025c34b3930e6341a697d4a0c37e6f2562012:frontend/src/features/patient/hooks/usePatientProfileOverview.ts

  const load = useCallback(async () => {
    setStatus('loading');

    try {
      const data = profileOverview ?? await fetchPatientProfileOverview();
      const isComplete = setupProfile != null ? true : data.isProfileComplete;
<<<<<<< HEAD:src/features/patient/hooks/usePatientProfileOverview.ts
      const nextProfile: PatientProfileOverview = { ...data, isProfileComplete: isComplete };
      const historySource = profile ?? setupProfile;

      if (historySource) {
        const heightStr = historySource.heightUnit === 'cm'
          ? `${historySource.heightCm} cm`
          : `${historySource.heightFeet}' ${historySource.heightInches}"`;
        const weightStr = `${historySource.weight} ${historySource.weightUnit}`;

        if (historySource.avatarUri != null) nextProfile.avatarUri = historySource.avatarUri;
        if (historySource.gender) {
          nextProfile.gender =
            historySource.gender.charAt(0).toUpperCase() + historySource.gender.slice(1);
        }
        if (historySource.dateOfBirth) nextProfile.dateOfBirth = historySource.dateOfBirth;
        if (historySource.heightCm || historySource.heightFeet) nextProfile.height = heightStr;
        if (historySource.weight) nextProfile.weight = weightStr;
        const syncedHistoryRecords = syncPatientHistoryMedicalRecord(
          nextProfile.medicalRecords,
          historySource,
        );
        nextProfile.medicalRecords = syncMedicationMedicalRecord(syncedHistoryRecords, historySource);
      }
=======
      const nextProfile = { ...data, isProfileComplete: isComplete };
>>>>>>> 290025c34b3930e6341a697d4a0c37e6f2562012:frontend/src/features/patient/hooks/usePatientProfileOverview.ts

      setProfileOverview(nextProfile);
      setSetupModalVisible(!nextProfile.isProfileComplete);
      setStatus('success');
    } catch {
      setStatus('error');
    }
<<<<<<< HEAD:src/features/patient/hooks/usePatientProfileOverview.ts
  }, [profileOverview, profile, setProfileOverview, setupProfile]);
=======
  }, [profileOverview, setProfileOverview, setupProfile]);
>>>>>>> 290025c34b3930e6341a697d4a0c37e6f2562012:frontend/src/features/patient/hooks/usePatientProfileOverview.ts

  useEffect(() => {
    if (!profileOverview) {
      load();
      return;
    }

    setSetupModalVisible(!profileOverview.isProfileComplete);
  }, [load, profileOverview]);

  const editForm = useMemo<ProfileOverviewForm | null>(() => {
    if (!profileOverview) return null;

    return {
      avatarUri: profileOverview.avatarUri,
      name: profileOverview.name,
      gender: profileOverview.gender,
<<<<<<< HEAD:src/features/patient/hooks/usePatientProfileOverview.ts
      dateOfBirth: profileOverview.dateOfBirth,
=======
>>>>>>> 290025c34b3930e6341a697d4a0c37e6f2562012:frontend/src/features/patient/hooks/usePatientProfileOverview.ts
      height: profileOverview.height,
      weight: profileOverview.weight,
      age: profileOverview.age,
      phone: profileOverview.phone,
      email: profileOverview.email,
      address: profileOverview.address,
      nationality: profileOverview.nationality,
      selectedLanguage: profileOverview.selectedLanguage,
    };
  }, [profileOverview]);

  const selectedRecord = useCallback(
    (id: ProfileRecordId) => profileOverview?.medicalRecords.find((record) => record.id === id),
    [profileOverview],
  );

<<<<<<< HEAD:src/features/patient/hooks/usePatientProfileOverview.ts
  const resetDetailModalState = useCallback(() => {
    setSelectedField(null);
    setDetailModalVisible(false);
    setIsEditingDetail(false);
    setDetailFieldValue('');
    setDetailValidationError(null);
    setIsSavingDetail(false);
  }, []);

  const openDetailModal = useCallback((field: ProfileOverviewDetailField) => {
    if (!profileOverview) return;
    setSelectedField(field);
    setDetailFieldValue(profileOverview[field]);
    setDetailValidationError(null);
    setIsEditingDetail(false);
    setIsSavingDetail(false);
    setDetailModalVisible(true);
  }, [profileOverview]);

  const closeDetailModal = useCallback(() => {
    resetDetailModalState();
  }, [resetDetailModalState]);

  const enableDetailEditing = useCallback(() => {
    if (!selectedField) return;
    setIsEditingDetail(true);
    setDetailValidationError(null);
  }, [selectedField]);

  const updateDetailValue = useCallback((value: string) => {
    setDetailFieldValue(value);
    if (detailValidationError) setDetailValidationError(null);
  }, [detailValidationError]);

  const saveDetailValue = useCallback(async () => {
    if (!profileOverview || !selectedField || isSavingDetail) return false;

    const config = DETAIL_FIELD_CONFIG[selectedField];
    const normalizedValue = config.normalize(detailFieldValue);

    if (!normalizedValue) {
      setDetailValidationError(config.emptyErrorKey);
      return false;
    }

    if (!config.validate(normalizedValue)) {
      setDetailValidationError(config.invalidErrorKey ?? config.emptyErrorKey);
      return false;
    }

    setIsSavingDetail(true);

    try {
      updateProfileOverview({ [selectedField]: normalizedValue });
      resetDetailModalState();
      return true;
    } finally {
      setIsSavingDetail(false);
    }
  }, [
    detailFieldValue,
    isSavingDetail,
    profileOverview,
    resetDetailModalState,
    selectedField,
    updateProfileOverview,
  ]);

  const saveProfile = useCallback((form: ProfileOverviewForm) => {
    const age = deriveAgeFromDob(form.dateOfBirth);
    updateProfileOverview({
      ...form,
      age: age || profileOverview?.age || '',
      isProfileComplete: true,
    });
    setSetupModalVisible(false);
  }, [updateProfileOverview, profileOverview?.age]);
=======
  const saveProfile = useCallback(async (form: ProfileOverviewForm) => {
    await updatePatientProfileOverview(form);
    updateProfileOverview({
      ...form,
      isProfileComplete: true,
    });
    setSetupModalVisible(false);
  }, [updateProfileOverview]);
>>>>>>> 290025c34b3930e6341a697d4a0c37e6f2562012:frontend/src/features/patient/hooks/usePatientProfileOverview.ts

  const setNotificationEnabled = useCallback((enabled: boolean) => {
    updateProfileOverview({ notificationEnabled: enabled });
  }, [updateProfileOverview]);

  const setSelectedLanguage = useCallback((language: string) => {
    updateProfileOverview({ selectedLanguage: language });
  }, [updateProfileOverview]);

  return {
    status,
    profile: profileOverview,
    isSetupModalVisible,
<<<<<<< HEAD:src/features/patient/hooks/usePatientProfileOverview.ts
    selectedField,
    isDetailModalVisible,
    isEditingDetail,
    detailFieldValue,
    detailValidationError,
    isSavingDetail,
=======
>>>>>>> 290025c34b3930e6341a697d4a0c37e6f2562012:frontend/src/features/patient/hooks/usePatientProfileOverview.ts
    editForm,
    selectedRecord,
    retry: load,
    dismissSetupModal: () => setSetupModalVisible(false),
<<<<<<< HEAD:src/features/patient/hooks/usePatientProfileOverview.ts
    openDetailModal,
    closeDetailModal,
    enableDetailEditing,
    updateDetailValue,
    saveDetailValue,
    setNotificationEnabled,
    setSelectedLanguage,
    validateEditForm: validateProfileEditForm,
=======
    setNotificationEnabled,
    setSelectedLanguage,
>>>>>>> 290025c34b3930e6341a697d4a0c37e6f2562012:frontend/src/features/patient/hooks/usePatientProfileOverview.ts
    saveProfile,
  };
}
