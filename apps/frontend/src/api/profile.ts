import type { User } from '@/types';
import client from './client';

export interface UpdateProfilePayload {
  name?: string;
  email?: string;
  password?: string;
  password_confirmation?: string;
}

export const profileApi = {
  getProfile: () =>
    client.get<User>('/profile').then((r) => r.data),

  updateProfile: (payload: UpdateProfilePayload) =>
    client.put<User>('/profile', payload).then((r) => r.data),
};
