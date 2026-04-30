import { useCallback, useEffect, useState } from 'react';
import { fetchHealthcareSupportData } from '../services/healthcareSupport.service';
import type { HealthcareSupportData } from '../types/profileOverview.types';

type HealthcareSupportStatus = 'loading' | 'error' | 'empty' | 'success';

export interface UseHealthcareSupportResult {
  status: HealthcareSupportStatus;
  data: HealthcareSupportData | null;
  retry: () => void;
}

export function useHealthcareSupport(): UseHealthcareSupportResult {
  const [status, setStatus] = useState<HealthcareSupportStatus>('loading');
  const [data, setData] = useState<HealthcareSupportData | null>(null);

  const load = useCallback(async () => {
    setStatus('loading');
    try {
      const result = await fetchHealthcareSupportData();
      if (!result.supportActivityList.length) {
        setData(result);
        setStatus('empty');
        return;
      }
      setData(result);
      setStatus('success');
    } catch {
      setStatus('error');
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { status, data, retry: load };
}
