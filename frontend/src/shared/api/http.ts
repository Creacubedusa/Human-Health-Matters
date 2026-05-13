import axios from 'axios';
import { getAccessToken, setAccessToken } from '@shared/api/token';
import { toast } from '@shared/components/ui/toast';
import { kvDelete } from '@shared/storage/kv';
import { useAuthStore } from '@shared/store/auth.store';
import { router } from 'expo-router';

function extractErrorMessage(err: any) {
  const data = err?.response?.data;
  if (typeof data === 'string' && data.trim()) return data;
  if (typeof data?.message === 'string' && data.message.trim()) return data.message;
  if (Array.isArray(data?.message) && data.message.length > 0) return String(data.message[0]);
  if (typeof err?.message === 'string' && err.message.trim()) return err.message;
  const status = err?.response?.status;
  if (status) return `Request failed (${status})`;
  return 'Request failed';
}

const baseURL = process.env.EXPO_PUBLIC_API_URL;

export const http = axios.create({
  baseURL,
  timeout: 20000,
});

http.interceptors.request.use(async (config) => {
  const token = await getAccessToken();
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

http.interceptors.response.use(
  (res) => res,
  async (err) => {
    const shouldToast = err?.config?.headers?.['x-suppress-toast'] !== '1';
    const status = err?.response?.status as number | undefined;

    if (status === 401) {
      // Session expired — clear persisted credentials and redirect to auth
      useAuthStore.getState().clearAuth();
      await setAccessToken(null);
      await kvDelete('app_role');
      await kvDelete('app_user_id');
      if (shouldToast) toast.warning('Session expired. Please log in again.');
      router.replace('/(auth)/select-language');
      return Promise.reject(err);
    }

    if (shouldToast) {
      const msg = extractErrorMessage(err);
      if (status && status >= 500) toast.error(msg);
      else toast.error(msg);
    }
    return Promise.reject(err);
  },
);

