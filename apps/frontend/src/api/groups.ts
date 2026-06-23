import type { Group } from '@/types';
import client from './client';

export const groupsApi = {
  getGroups: () =>
    client.get<Group[]>('/groups').then((r) => r.data),

  createGroup: (name: string, memberIds?: string[]) =>
    client.post<Group>('/groups', { name, member_ids: memberIds }).then((r) => r.data),
};
