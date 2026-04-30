import { useCallback, useEffect, useMemo, useState } from 'react';
import { fetchCarePlans } from '../services/carePlan.service';
import type { CarePlan, CarePlanStatus } from '../types/carePlan.types';

type CarePlanLoadStatus = 'loading' | 'error' | 'empty' | 'success';

export interface UseCarePlansResult {
  status: CarePlanLoadStatus;
  carePlans: CarePlan[];
  activeStatus: CarePlanStatus;
  selectedCarePlans: CarePlan[];
  getCarePlanById: (id: string) => CarePlan | undefined;
  setActiveStatus: (status: CarePlanStatus) => void;
  retry: () => void;
}

export function useCarePlans(initialStatus: CarePlanStatus = 'active'): UseCarePlansResult {
  const [status, setStatus] = useState<CarePlanLoadStatus>('loading');
  const [carePlans, setCarePlans] = useState<CarePlan[]>([]);
  const [activeStatus, setActiveStatus] = useState<CarePlanStatus>(initialStatus);

  const loadCarePlans = useCallback(async () => {
    setStatus('loading');

    try {
      const data = await fetchCarePlans();
      setCarePlans(data);
      setStatus(data.length > 0 ? 'success' : 'empty');
    } catch {
      setStatus('error');
    }
  }, []);

  useEffect(() => {
    loadCarePlans();
  }, [loadCarePlans]);

  const selectedCarePlans = useMemo(
    () => carePlans.filter((carePlan) => carePlan.status === activeStatus),
    [activeStatus, carePlans],
  );

  const getCarePlanById = useCallback(
    (id: string) => carePlans.find((carePlan) => carePlan.id === id),
    [carePlans],
  );

  return {
    status,
    carePlans,
    activeStatus,
    selectedCarePlans,
    getCarePlanById,
    setActiveStatus,
    retry: loadCarePlans,
  };
}
