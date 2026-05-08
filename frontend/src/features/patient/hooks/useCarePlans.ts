import { useCallback, useEffect, useMemo, useState } from 'react';
import { useCarePlanStore } from '../store/carePlan.store';
import { fetchCarePlanById, fetchCarePlans } from '../services/carePlan.service';
import type { CarePlan, CarePlanStatus } from '../types/carePlan.types';

type CarePlanLoadStatus = 'loading' | 'error' | 'empty' | 'success';

export interface UseCarePlansResult {
  status: CarePlanLoadStatus;
  carePlans: CarePlan[];
  activeStatus: CarePlanStatus;
  selectedCarePlans: CarePlan[];
  getCarePlanById: (id: string) => CarePlan | undefined;
  fetchCarePlanDetail: (id: string) => Promise<CarePlan | null>;
  setActiveStatus: (status: CarePlanStatus) => void;
  refresh: () => Promise<void>;
  refreshing: boolean;
  retry: () => Promise<void>;
}

export function useCarePlans(initialStatus: CarePlanStatus = 'active'): UseCarePlansResult {
  const [activeStatus, setActiveStatus] = useState<CarePlanStatus>(initialStatus);
  const carePlans = useCarePlanStore((state) => state.carePlans);
  const setCarePlans = useCarePlanStore((state) => state.setCarePlans);
  const addCarePlan = useCarePlanStore((state) => state.addCarePlan);
  const [status, setStatus] = useState<CarePlanLoadStatus>(
    carePlans.length > 0 ? 'success' : 'loading',
  );
  const [refreshing, setRefreshing] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);

  const load = useCallback(async () => {
    try {
      const items = await fetchCarePlans();
      setCarePlans(items);
      setStatus(items.length === 0 ? 'empty' : 'success');
    } catch {
      setStatus('error');
    }
  }, [setCarePlans]);

  useEffect(() => {
    if (hasLoaded) return;
    setHasLoaded(true);
    void load();
  }, [hasLoaded, load]);

  const selectedCarePlans = useMemo(
    () => carePlans.filter((carePlan) => carePlan.status === activeStatus),
    [activeStatus, carePlans],
  );

  const getCarePlanById = useCallback(
    (id: string) => carePlans.find((carePlan) => carePlan.id === id),
    [carePlans],
  );

  const fetchCarePlanDetail = useCallback(
    async (id: string) => {
      const existing = carePlans.find((p) => p.id === id);
      if (existing) return existing;
      const detail = await fetchCarePlanById(id);
      if (detail) addCarePlan(detail);
      return detail;
    },
    [carePlans, addCarePlan],
  );

  async function refresh() {
    setRefreshing(true);
    try {
      await load();
    } finally {
      setRefreshing(false);
    }
  }

  async function retry() {
    setStatus('loading');
    await load();
  }

  return {
    status,
    carePlans,
    activeStatus,
    selectedCarePlans,
    getCarePlanById,
    fetchCarePlanDetail,
    setActiveStatus,
    refresh,
    refreshing,
    retry,
  };
}
