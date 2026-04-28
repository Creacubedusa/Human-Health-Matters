import { useEffect, useState } from 'react';
import { fetchDoctorDashboard } from '../services/doctor.service';
import { useDoctorStore } from '../store/doctor.store';
import type { DoctorDashboard } from '../types/doctor.types';

type Status = 'loading' | 'error' | 'success';

interface UseDoctorHomeResult {
  status: Status;
  dashboard: DoctorDashboard | null;
  retry: () => void;
}

export function useDoctorHome(): UseDoctorHomeResult {
  const { dashboard, setDashboard } = useDoctorStore();
  const [status, setStatus] = useState<Status>(dashboard ? 'success' : 'loading');

  const load = async () => {
    setStatus('loading');
    try {
      const data = await fetchDoctorDashboard();
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
