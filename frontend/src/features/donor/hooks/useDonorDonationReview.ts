import { useState } from 'react';
import { submitDonation } from '../services/donorDonation.service';
import { useDonorDonationStore } from '../store/donorDonation.store';

export function useDonorDonationReview() {
  const { draft, resetDraft } = useDonorDonationStore();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  async function handleDonate() {
    setIsProcessing(true);
    try {
      await submitDonation(draft);
      setIsProcessing(false);
      setIsSuccess(true);
    } catch {
      setIsProcessing(false);
    }
  }

  function handleSuccessClose(onSuccess: () => void) {
    resetDraft();
    onSuccess();
  }

  return {
    draft,
    isProcessing,
    isSuccess,
    handleDonate,
    handleSuccessClose,
  };
}
