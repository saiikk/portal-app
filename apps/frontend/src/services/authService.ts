import AsyncStorage from '@react-native-async-storage/async-storage';

import { authApi, type LoginCredentials } from '@/api/auth';
import { AUTH_TOKEN_KEY } from '@/constants/storage';
import type { User } from '@/types';

export const authService = {
  login: async (credentials: LoginCredentials): Promise<User> => {
    const { user, token } = await authApi.login(credentials);
    await AsyncStorage.setItem(AUTH_TOKEN_KEY, token);
    return user;
  },

  logout: async (): Promise<void> => {
    await authApi.logout();
    await AsyncStorage.removeItem(AUTH_TOKEN_KEY);
  },

  getStoredToken: (): Promise<string | null> =>
    AsyncStorage.getItem(AUTH_TOKEN_KEY),
};
