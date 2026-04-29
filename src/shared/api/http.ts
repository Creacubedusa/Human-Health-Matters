import axios from 'axios';
import { getAccessToken } from '@shared/api/token';

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

