import { useCallback, useMemo, useState } from 'react';
import { useCarePlanStore } from '../store/carePlan.store';
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
  const [activeStatus, setActiveStatus] = useState<CarePlanStatus>(initialStatus);
  const carePlans = useCarePlanStore((state) => state.carePlans);
  const status: CarePlanLoadStatus = carePlans.length > 0 ? 'success' : 'empty';

  const loadCarePlans = useCallback(() => {}, []);

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
