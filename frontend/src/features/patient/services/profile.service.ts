import type { ProfileSetupPayload } from '../types/profile.types';
import { http } from '@shared/api/http';
import { uploadImageToCloudinary } from '@shared/api/cloudinary';

export async function setupPatientProfile(data: ProfileSetupPayload): Promise<void> {
  const { userId, ...payload } = data;
  void userId;

  const avatarUri =
    payload.avatarUri && payload.avatarUri.startsWith('file:')
      ? (await uploadImageToCloudinary({ uri: payload.avatarUri, filename: `avatar_${userId ?? 'patient'}.jpg` }))
          .secureUrl
      : payload.avatarUri;

  await http.post('/patients/profile/setup', { payload: { ...payload, avatarUri } });
}
