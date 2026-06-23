import type { Group, User } from '@/types';
import client from './client';

export type GroupMember = Pick<User, 'id' | 'name' | 'icon_url' | 'type'> & { role: 'owner' | 'member' };

export const groupsApi = {
  getGroups: () =>
    client.get<Group[]>('/groups').then((r) => r.data),

  getMembers: (groupId: string) =>
    client.get<GroupMember[]>(`/groups/${groupId}/members`).then((r) => r.data),

  updateMemberRole: (groupId: string, userId: string, role: 'owner' | 'member') =>
    client.patch(`/groups/${groupId}/members/${userId}`, { role }).then((r) => r.data),

  createGroup: (name: string, memberIds?: string[]) =>
    client.post<Group>('/groups', { name, member_ids: memberIds }).then((r) => r.data),
};
