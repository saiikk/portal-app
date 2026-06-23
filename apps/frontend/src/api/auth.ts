import type { User } from '@/types';
import client from './client';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export const authApi = {
  login: (credentials: LoginCredentials) =>
    client.post<AuthResponse>('/login', credentials).then((r) => r.data),

  logout: () =>
    client.post<{ message: string }>('/logout').then((r) => r.data),

  me: () =>
    client.get<User>('/me').then((r) => r.data),
};
