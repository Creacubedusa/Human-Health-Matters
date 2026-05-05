import { useState } from 'react';
import { useDonorDonationStore } from '../store/donorDonation.store';
import type { DonorDonationType } from '../types/donorDonation.types';

export const PRESET_AMOUNTS = [50, 100, 150, 500, 1000, 1500];

export function useDonorDonationAmount() {
  const { draft, setAmount, setType } = useDonorDonationStore();
  const [customInput, setCustomInput] = useState('');

  function handlePresetSelect(value: number) {
    setAmount(value);
    setCustomInput('');
  }

  function handleCustomChange(text: string) {
    const digits = text.replace(/[^0-9]/g, '');
    setCustomInput(digits);
    const parsed = parseInt(digits, 10);
    if (!isNaN(parsed) && parsed > 0) {
      setAmount(parsed);
    }
  }

  function handleTypeToggle(type: DonorDonationType) {
    setType(type);
  }

  const isPresetSelected = (value: number) =>
    customInput === '' && draft.amount === value;

  return {
    amount: draft.amount,
    type: draft.type,
    customInput,
    isPresetSelected,
    handlePresetSelect,
    handleCustomChange,
    handleTypeToggle,
  };
}
