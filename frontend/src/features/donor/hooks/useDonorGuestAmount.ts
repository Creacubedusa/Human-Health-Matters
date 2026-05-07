import { useState } from 'react';
import { useDonorGuestStore, type DonorGuestFrequency } from '../store/donorGuest.store';

export const GUEST_PRESET_AMOUNTS = [50, 100, 150, 500, 1000, 1500];

export function useDonorGuestAmount() {
  const { amount, frequency, setAmount, setFrequency } = useDonorGuestStore();
  const [customInput, setCustomInput] = useState('');

  function handlePresetSelect(value: number) {
    setAmount(value);
    setCustomInput('');
  }

  function handleCustomChange(text: string) {
    const digits = text.replace(/[^0-9]/g, '');
    setCustomInput(digits);
    const parsed = parseInt(digits, 10);
    if (!isNaN(parsed) && parsed > 0) setAmount(parsed);
  }

  function handleFrequencyToggle(freq: DonorGuestFrequency) {
    setFrequency(freq);
  }

  const isPresetSelected = (value: number) => customInput === '' && amount === value;

  return { amount, frequency, customInput, isPresetSelected, handlePresetSelect, handleCustomChange, handleFrequencyToggle };
}
