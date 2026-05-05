import { useEffect, useState } from 'react';
import { fetchDonorProfile } from '../services/donorProfile.service';
import { useDonorProfileStore } from '../store/donorProfile.store';
import type { DonorProfileData } from '../types/donorProfile.types';

type Status = 'loading' | 'error' | 'success';

export interface UseDonorProfileResult {
  status: Status;
  profile: DonorProfileData | null;
  retry: () => void;
  handleToggleNotifications: (enabled: boolean) => void;
}

export function useDonorProfile(): UseDonorProfileResult {
  const { profile, setProfile, updateNotifications } = useDonorProfileStore();
  const [status, setStatus] = useState<Status>(profile ? 'success' : 'loading');

  const load = async () => {
    setStatus('loading');
    try {
      const data = await fetchDonorProfile();
      setProfile(data);
      setStatus('success');
    } catch {
      setStatus('error');
    }
  };

  useEffect(() => {
    if (!profile) void load();
  }, []);

  function handleToggleNotifications(enabled: boolean) {
    updateNotifications(enabled);
  }

  return { status, profile, retry: load, handleToggleNotifications };
}
