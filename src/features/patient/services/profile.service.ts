import type { ProfileSetupPayload } from '../types/profile.types';
import { http } from '@shared/api/http';

export async function setupPatientProfile(data: ProfileSetupPayload): Promise<void> {
  const { userId, ...payload } = data;
  void userId;
  await http.post('/patients/profile/setup', { payload });
}
