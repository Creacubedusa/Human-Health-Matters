import { useEffect, useState } from 'react';
import { fetchTriageHistory } from '../services/triage.service';
import { useTriageStore } from '../store/triage.store';

type Status = 'loading' | 'error' | 'success';

export function useTriageHistory() {
  const { history, setHistory } = useTriageStore();
  const [status, setStatus] = useState<Status>(history.length > 0 ? 'success' : 'loading');

  async function load() {
    setStatus('loading');
    try {
      const data = await fetchTriageHistory();
      setHistory(data);
      setStatus('success');
    } catch {
      setStatus('error');
    }
  }

  useEffect(() => {
    if (history.length === 0) load();
  }, []);

  return { history, status, retry: load };
}
