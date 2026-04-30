import axios from 'axios';
import { getAccessToken } from '@shared/api/token';
import { toast } from '@shared/components/ui/toast';

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
  (err) => {
    const shouldToast = err?.config?.headers?.['x-suppress-toast'] !== '1';
    if (shouldToast) {
      const status = err?.response?.status as number | undefined;
      const msg = extractErrorMessage(err);
      if (status && status >= 500) toast.error(msg);
      else if (status === 401) toast.warning('Session expired. Please log in again.');
      else toast.error(msg);
    }
    return Promise.reject(err);
  },
);

