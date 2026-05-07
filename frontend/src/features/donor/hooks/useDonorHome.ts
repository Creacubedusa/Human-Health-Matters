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
  const { dashboard, setDashboard, simulateDashboardTick } = useDonorStore();
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

  useEffect(() => {
    if (!dashboard) return;

    const interval = setInterval(() => {
      simulateDashboardTick();
    }, 3500);

    return () => clearInterval(interval);
  }, [dashboard, simulateDashboardTick]);

  return { status, dashboard, retry: load };
}
