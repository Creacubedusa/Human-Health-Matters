import { useMemo } from 'react';
import { useDoctorPatientsStore } from '../store/doctorPatients.store';

export function useDoctorPatientProfile(patientId: string) {
  const patient = useDoctorPatientsStore((state) =>
    state.patients.find((item) => item.id === patientId) ?? null,
  );
  const successKey = useDoctorPatientsStore((state) => state.successByPatientId[patientId] ?? null);
  const clearSuccess = useDoctorPatientsStore((state) => state.clearSuccess);

  const hasMedicalRecords = useMemo(() => {
    if (!patient) return false;

    return (
      patient.medicalRecords.patientHistory.length > 0 ||
      patient.medicalRecords.medication.length > 0 ||
      patient.medicalRecords.orders.length > 0 ||
      patient.medicalRecords.tests.length > 0 ||
      patient.medicalRecords.prescriptions.length > 0 ||
      patient.medicalRecords.reports.length > 0
    );
  }, [patient]);

  return {
    patient,
    successKey,
    clearSuccess: () => clearSuccess(patientId),
    hasMedicalRecords,
  };
}
