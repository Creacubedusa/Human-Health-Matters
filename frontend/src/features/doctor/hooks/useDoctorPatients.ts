import { useEffect, useMemo, useState } from 'react';
import { format } from 'date-fns';
import { fetchDoctorPatients } from '../services/doctor.service';
import type { DoctorPatientListItem } from '../types/doctor.types';

type Status = 'loading' | 'error' | 'success';

function buildPatientItem(remote: {
  id: string;
  name: string;
  lastVisit: string;
  avatarUri: string | null;
}): DoctorPatientListItem {
  return {
    id: remote.id,
    name: remote.name || 'Patient',
    age: 0,
    gender: 'Patient',
    appointmentTime: format(new Date(remote.lastVisit), 'MMM d, yyyy'),
    severity: 'low',
    aiSummary: {
      label: 'Last visit',
      summary: `Last visit on ${format(new Date(remote.lastVisit), 'MMM d, yyyy')}`,
    },
    symptoms: [],
    avatarUri: remote.avatarUri ?? undefined,
  };
}

export function useDoctorPatients() {
  const [patients, setPatients] = useState<DoctorPatientListItem[]>([]);
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<Status>('loading');
  const [refreshing, setRefreshing] = useState(false);

  async function load(options?: { silent?: boolean }) {
    if (!options?.silent) setStatus('loading');
    try {
      const remote = await fetchDoctorPatients();
      setPatients(remote.map(buildPatientItem));
      setStatus('success');
    } catch {
      if (!options?.silent) setStatus('error');
    }
  }

  async function refresh() {
    setRefreshing(true);
    try {
      await load({ silent: true });
    } finally {
      setRefreshing(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  const filteredPatients = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return patients;

    return patients.filter((patient) => {
      const haystacks = [
        patient.name,
        patient.gender,
        patient.aiSummary.summary,
        patient.aiSummary.label,
        patient.appointmentTime,
        ...patient.symptoms,
      ];

      return haystacks.some((value) => value.toLowerCase().includes(normalizedQuery));
    });
  }, [patients, query]);

  const isAiEnhancedSearch = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return false;

    return filteredPatients.some((patient) => {
      const matchesName = patient.name.toLowerCase().includes(normalizedQuery);
      const matchesAi = [patient.aiSummary.summary, ...patient.symptoms].some((value) =>
        value.toLowerCase().includes(normalizedQuery),
      );

      return !matchesName && matchesAi;
    });
  }, [filteredPatients, query]);

  return {
    status,
    refreshing,
    query,
    setQuery,
    patients: filteredPatients,
    allPatientsCount: patients.length,
    isAiEnhancedSearch,
    retry: () => void load(),
    refresh,
  };
}
