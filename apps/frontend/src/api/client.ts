import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

import { API_BASE_URL } from '@/constants/api';
import { AUTH_TOKEN_KEY } from '@/constants/storage';

const client = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    Accept: 'application/json',
  },
});

client.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem(AUTH_TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

client.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await AsyncStorage.removeItem(AUTH_TOKEN_KEY);
    }
    return Promise.reject(error);
  }
);

export default client;
