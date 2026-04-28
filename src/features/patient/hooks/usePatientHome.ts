import { useEffect, useState } from 'react';
import { fetchPatientDashboard } from '../services/patient.service';
import { usePatientStore } from '../store/patient.store';
import type { PatientHomeDashboard } from '../types/patient.types';

type Status = 'loading' | 'error' | 'success';

interface UsePatientHomeResult {
  status: Status;
  dashboard: PatientHomeDashboard | null;
  retry: () => void;
}

export function usePatientHome(): UsePatientHomeResult {
  const { dashboard, setDashboard } = usePatientStore();
  const [status, setStatus] = useState<Status>(dashboard ? 'success' : 'loading');

  const load = async () => {
    setStatus('loading');
    try {
      const data = await fetchPatientDashboard();
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
