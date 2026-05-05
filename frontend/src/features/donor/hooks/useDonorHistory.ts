import { useEffect, useState } from 'react';
import { fetchDonorHistory } from '../services/donorHistory.service';
import type { DonorHistoryItem } from '../types/donorHistory.types';

type Status = 'loading' | 'error' | 'success';

export interface UseDonorHistoryResult {
  status: Status;
  items: DonorHistoryItem[];
  fromDate: string;
  toDate: string;
  setFromDate: (v: string) => void;
  setToDate: (v: string) => void;
  retry: () => void;
}

export function useDonorHistory(): UseDonorHistoryResult {
  const [status, setStatus] = useState<Status>('loading');
  const [items, setItems] = useState<DonorHistoryItem[]>([]);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  const load = async () => {
    setStatus('loading');
    try {
      const data = await fetchDonorHistory(fromDate || undefined, toDate || undefined);
      setItems(data);
      setStatus('success');
    } catch {
      setStatus('error');
    }
  };

  useEffect(() => { void load(); }, []);

  return { status, items, fromDate, toDate, setFromDate, setToDate, retry: load };
}
