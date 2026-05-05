import { useState } from 'react';
import { useDonorProfileStore } from '../store/donorProfile.store';
import type { DonorFrequency } from '../types/donorProfile.types';

export interface UseDonorFrequencyResult {
  selected: DonorFrequency;
  setSelected: (v: DonorFrequency) => void;
  handleSave: (onSuccess: () => void) => void;
}

export function useDonorFrequency(): UseDonorFrequencyResult {
  const { profile, updateFrequency } = useDonorProfileStore();
  const [selected, setSelected] = useState<DonorFrequency>(profile?.frequency ?? 'monthly');

  function handleSave(onSuccess: () => void) {
    updateFrequency(selected, profile?.donationAmount ?? 25);
    onSuccess();
  }

  return { selected, setSelected, handleSave };
}
