import { useEffect, useState } from 'react';
import { fetchDonorDashboard } from '../services/donor.service';
import { useDonorStore } from '../store/donor.store';
import type { DonorDashboard } from '../types/donor.types';

type Status = 'loading' | 'error' | 'success';

interface UseDonorHomeResult {
  status: Status;
  dashboard: DonorDashboard | null;
  retry: () => void;
}

export function useDonorHome(): UseDonorHomeResult {
  const { dashboard, setDashboard } = useDonorStore();
  const [status, setStatus] = useState<Status>(dashboard ? 'success' : 'loading');

  const load = async () => {
    setStatus('loading');
    try {
      const data = await fetchDonorDashboard();
      setDashboard(data);
      setStatus('success');
    } catch {
      setStatus('error');
    }
  };

  useEffect(() => {
    if (!dashboard) load();
  }, []);

  return { status, dashboard, retry: load };
}
