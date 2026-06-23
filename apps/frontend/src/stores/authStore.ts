import { create } from 'zustand';

import { authApi } from '@/api/auth';
import { type LoginCredentials } from '@/api/auth';
import { authService } from '@/services/authService';
import type { User } from '@/types';

interface AuthStore {
  user: User | null;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isLoading: true,

  login: async (credentials) => {
    const user = await authService.login(credentials);
    set({ user });
  },

  logout: async () => {
    await authService.logout();
    set({ user: null });
  },

  initialize: async () => {
    const token = await authService.getStoredToken();
    if (!token) {
      set({ isLoading: false });
      return;
    }
    try {
      const user = await authApi.me();
      set({ user, isLoading: false });
    } catch {
      set({ isLoading: false });
    }
  },
}));
