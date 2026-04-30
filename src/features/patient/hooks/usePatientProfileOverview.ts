import { useCallback, useEffect, useMemo, useState } from 'react';
import { fetchPatientProfileOverview } from '../services/profileOverview.service';
import { usePatientStore } from '../store/patient.store';
import type {
  PatientProfileOverview,
  ProfileOverviewForm,
  ProfileRecordId,
} from '../types/profileOverview.types';

type ProfileOverviewStatus = 'loading' | 'error' | 'empty' | 'success';

export interface UsePatientProfileOverviewResult {
  status: ProfileOverviewStatus;
  profile: PatientProfileOverview | null;
  isSetupModalVisible: boolean;
  editForm: ProfileOverviewForm | null;
  selectedRecord: (id: ProfileRecordId) => PatientProfileOverview['medicalRecords'][number] | undefined;
  retry: () => void;
  dismissSetupModal: () => void;
  setNotificationEnabled: (enabled: boolean) => void;
  setSelectedLanguage: (language: string) => void;
  saveProfile: (form: ProfileOverviewForm) => void;
}

export function usePatientProfileOverview(): UsePatientProfileOverviewResult {
  const {
    profileOverview,
    setupProfile,
    setProfileOverview,
    updateProfileOverview,
  } = usePatientStore();

  const [status, setStatus] = useState<ProfileOverviewStatus>(profileOverview ? 'success' : 'loading');
  const [isSetupModalVisible, setSetupModalVisible] = useState(false);

  const load = useCallback(async () => {
    setStatus('loading');

    try {
      const data = profileOverview ?? await fetchPatientProfileOverview();
      const isComplete = setupProfile != null ? true : data.isProfileComplete;
      const nextProfile = { ...data, isProfileComplete: isComplete };

      setProfileOverview(nextProfile);
      setSetupModalVisible(!nextProfile.isProfileComplete);
      setStatus('success');
    } catch {
      setStatus('error');
    }
  }, [profileOverview, setProfileOverview, setupProfile]);

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

  const saveProfile = useCallback((form: ProfileOverviewForm) => {
    updateProfileOverview({
      ...form,
      isProfileComplete: true,
    });
    setSetupModalVisible(false);
  }, [updateProfileOverview]);

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
    editForm,
    selectedRecord,
    retry: load,
    dismissSetupModal: () => setSetupModalVisible(false),
    setNotificationEnabled,
    setSelectedLanguage,
    saveProfile,
  };
}
