import { useEffect, useState } from 'react';
import { fetchPatientDashboard } from '../services/patient.service';
import { usePatientStore } from '../store/patient.store';
import type { PatientHomeDashboard } from '../types/patient.types';

type Status = 'loading' | 'error' | 'success';

interface UsePatientHomeResult {
  status: Status;
  refreshing: boolean;
  dashboard: PatientHomeDashboard | null;
  retry: () => void;
  refresh: () => Promise<void>;
}

export function usePatientHome(): UsePatientHomeResult {
  const { dashboard, setDashboard } = usePatientStore();
  const [status, setStatus] = useState<Status>(dashboard ? 'success' : 'loading');
  const [refreshing, setRefreshing] = useState(false);

  const load = async (options?: { silent?: boolean }) => {
    if (!options?.silent) setStatus('loading');
    try {
      const data = await fetchPatientDashboard();
      setDashboard(data);
      setStatus('success');
    } catch {
      if (!options?.silent) setStatus('error');
    }
  };

  const refresh = async () => {
    setRefreshing(true);
    try {
      await load({ silent: true });
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (!dashboard) {
      void load();
    } else {
      void load({ silent: true });
    }
  }, []);

  return { status, refreshing, dashboard, retry: () => void load(), refresh };
}
