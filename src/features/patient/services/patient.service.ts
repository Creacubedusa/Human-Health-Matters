import type { PatientHomeDashboard } from '../types/patient.types';
import { http } from '@shared/api/http';

export async function fetchPatientDashboard(): Promise<PatientHomeDashboard> {
  const res = await http.get<PatientHomeDashboard>('/patients/dashboard');
  return res.data;
}
