import { useEffect, useMemo, useState } from 'react';
import { useDoctorPatientsStore } from '../store/doctorPatients.store';

type Status = 'loading' | 'success';

export function useDoctorPatients() {
  const patients = useDoctorPatientsStore((state) => state.patients);
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<Status>('loading');

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setStatus('success');
    }, 300);

    return () => clearTimeout(timeoutId);
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
    query,
    setQuery,
    patients: filteredPatients,
    allPatientsCount: patients.length,
    isAiEnhancedSearch,
  };
}
