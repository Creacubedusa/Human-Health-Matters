import { kvDelete, kvGet, kvSet } from '@shared/storage/kv';

const TOKEN_KEY = 'hhm_access_token';

export async function setAccessToken(token: string | null) {
  if (!token) {
    await kvDelete(TOKEN_KEY);
    return;
  }
  await kvSet(TOKEN_KEY, token);
}

export async function getAccessToken(): Promise<string | null> {
  return kvGet(TOKEN_KEY);
}

