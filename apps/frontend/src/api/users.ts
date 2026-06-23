import type { Employee, NewGraduate } from '@/types';
import client from './client';

export const usersApi = {
  getNewGraduates: () =>
    client.get<NewGraduate[]>('/users/new-graduates').then((r) => r.data),

  getEmployees: () =>
    client.get<Employee[]>('/users/employees').then((r) => r.data),
};
