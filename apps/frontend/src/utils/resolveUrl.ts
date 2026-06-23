import { API_BASE_URL } from '@/constants/api';

const API_ORIGIN = API_BASE_URL.replace(/\/api$/, '');

export function resolveMediaUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  return url.replace(/^https?:\/\/localhost(:\d+)?/, API_ORIGIN);
}
