import { http } from '@shared/api/http';
import { z } from 'zod';

const SignatureSchema = z.object({
  cloudName: z.string(),
  apiKey: z.string(),
  timestamp: z.number(),
  folder: z.string(),
  publicId: z.string().nullable().optional(),
  signature: z.string(),
});

export type CloudinaryUploadResult = {
  secureUrl: string;
  publicId: string;
};

export async function uploadImageToCloudinary(args: {
  uri: string;
  filename?: string;
  mimeType?: string;
  folder?: string;
}): Promise<CloudinaryUploadResult> {
  const publicId = (args.filename ?? `avatar_${Date.now()}`).replace(/\.[^/.]+$/, '');
  const sigRes = await http.post('/uploads/cloudinary/signature', {
    folder: args.folder,
    publicId,
  });
  const sig = SignatureSchema.parse(sigRes.data);

  const endpoint = `https://api.cloudinary.com/v1_1/${sig.cloudName}/image/upload`;
  const form = new FormData();
  form.append('api_key', sig.apiKey);
  form.append('timestamp', String(sig.timestamp));
  form.append('folder', sig.folder);
  if (sig.publicId) form.append('public_id', sig.publicId);
  form.append('signature', sig.signature);

  const name = args.filename ?? `${publicId}.jpg`;
  const type = args.mimeType ?? 'image/jpeg';
  form.append('file', { uri: args.uri, name, type } as any);

  const res = await fetch(endpoint, {
    method: 'POST',
    body: form,
  });
  const json = (await res.json()) as any;
  if (!res.ok) {
    throw new Error(json?.error?.message ?? 'cloudinary_upload_failed');
  }

  return {
    secureUrl: String(json.secure_url ?? ''),
    publicId: String(json.public_id ?? ''),
  };
}

export async function uploadFileToCloudinary(args: {
  uri: string;
  filename?: string;
  mimeType?: string;
  folder?: string;
}): Promise<CloudinaryUploadResult> {
  const publicId = (args.filename ?? `file_${Date.now()}`).replace(/\.[^/.]+$/, '');
  const sigRes = await http.post('/uploads/cloudinary/signature', {
    folder: args.folder,
    publicId,
  });
  const sig = SignatureSchema.parse(sigRes.data);

  const endpoint = `https://api.cloudinary.com/v1_1/${sig.cloudName}/auto/upload`;
  const form = new FormData();
  form.append('api_key', sig.apiKey);
  form.append('timestamp', String(sig.timestamp));
  form.append('folder', sig.folder);
  if (sig.publicId) form.append('public_id', sig.publicId);
  form.append('signature', sig.signature);

  const name = args.filename ?? `${publicId}`;
  const type = args.mimeType ?? 'application/octet-stream';
  form.append('file', { uri: args.uri, name, type } as any);

  const res = await fetch(endpoint, {
    method: 'POST',
    body: form,
  });
  const json = (await res.json()) as any;
  if (!res.ok) {
    throw new Error(json?.error?.message ?? 'cloudinary_upload_failed');
  }

  return {
    secureUrl: String(json.secure_url ?? ''),
    publicId: String(json.public_id ?? ''),
  };
}

