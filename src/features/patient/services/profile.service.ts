import type { ProfileSetupPayload } from '../types/profile.types';

// Stub — replace with real API call via shared/api
export async function setupPatientProfile(data: ProfileSetupPayload): Promise<void> {
  void data;
  await new Promise<void>((r) => setTimeout(r, 1200));
}
