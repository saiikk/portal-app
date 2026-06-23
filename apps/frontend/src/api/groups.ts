import type { Group } from '@/types';
import client from './client';

export const groupsApi = {
  getGroups: () =>
    client.get<Group[]>('/groups').then((r) => r.data),

  createGroup: (name: string) =>
    client.post<Group>('/groups', { name }).then((r) => r.data),
};
