import { useState } from 'react';
import { submitGuestDonation } from '../services/donorGuest.service';
import { useDonorGuestStore } from '../store/donorGuest.store';

export function useDonorGuestReview() {
  const { amount, frequency, resetGuest } = useDonorGuestStore();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  async function handleDonate() {
    setIsProcessing(true);
    try {
      await submitGuestDonation(amount, frequency);
      setIsProcessing(false);
      setIsSuccess(true);
    } catch {
      setIsProcessing(false);
    }
  }

  function handleClose(onSuccess: () => void) {
    resetGuest();
    onSuccess();
  }

  return { amount, frequency, isProcessing, isSuccess, handleDonate, handleClose };
}
