import { useEffect, useState } from 'react';
import { fetchSavedPaymentMethods } from '../services/donorDonation.service';
import { useDonorDonationStore } from '../store/donorDonation.store';
import type { DonorSavedPaymentMethod } from '../types/donorDonation.types';

type Status = 'loading' | 'error' | 'success';

export function useDonorPaymentMethod() {
  const { draft, setPaymentMethod } = useDonorDonationStore();
  const [status, setStatus] = useState<Status>('loading');
  const [methods, setMethods] = useState<DonorSavedPaymentMethod[]>([]);

  const load = async () => {
    setStatus('loading');
    try {
      const data = await fetchSavedPaymentMethods();
      setMethods(data);
      setStatus('success');
    } catch {
      setStatus('error');
    }
  };

  useEffect(() => { void load(); }, []);

  function handleSelect(id: string) {
    setPaymentMethod(id);
  }

  return {
    status,
    methods,
    selectedId: draft.selectedPaymentMethodId,
    amount: draft.amount,
    handleSelect,
    retry: load,
  };
}
