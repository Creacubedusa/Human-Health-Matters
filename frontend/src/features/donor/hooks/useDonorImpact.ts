import { useEffect, useState } from 'react';
import { fetchDonorImpact } from '../services/donorImpact.service';
import type { DonorImpactSummary } from '../types/donorImpact.types';

type Status = 'loading' | 'error' | 'success';

export interface UseDonorImpactResult {
  status: Status;
  summary: DonorImpactSummary | null;
  retry: () => void;
}

export function useDonorImpact(): UseDonorImpactResult {
  const [status, setStatus] = useState<Status>('loading');
  const [summary, setSummary] = useState<DonorImpactSummary | null>(null);

  const load = async () => {
    setStatus('loading');
    try {
      const data = await fetchDonorImpact();
      setSummary(data);
      setStatus('success');
    } catch {
      setStatus('error');
    }
  };

  useEffect(() => { void load(); }, []);

  return { status, summary, retry: load };
}
