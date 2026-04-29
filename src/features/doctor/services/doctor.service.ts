import type { DoctorDashboard } from '../types/doctor.types';
import { http } from '@shared/api/http';

export async function fetchDoctorDashboard(): Promise<DoctorDashboard> {
  const res = await http.get<DoctorDashboard>('/doctor/dashboard');
  return res.data;
}
