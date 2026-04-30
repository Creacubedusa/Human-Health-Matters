import { useTriageStore } from '../store/triage.store';

type Status = 'loading' | 'error' | 'success';

export function useTriageHistory() {
  const { history } = useTriageStore();

  return {
    history,
    status: 'success' as Status,
    retry: () => {},
  };
}
