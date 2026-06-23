import type { Employee, NewGraduate, UserType } from '@/types';
import client from './client';

export type UserSummary = { id: string; name: string; type: UserType; has_group: boolean };

export const usersApi = {
  getAll: () =>
    client.get<UserSummary[]>('/users').then((r) => r.data),

  getNewGraduates: () =>
    client.get<NewGraduate[]>('/users/new-graduates').then((r) => r.data),

  getEmployees: () =>
    client.get<Employee[]>('/users/employees').then((r) => r.data),
};
