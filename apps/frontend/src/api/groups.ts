import { supabase } from '@/lib/supabase';
import type { Group, User } from '@/types';

export type GroupMember = Pick<User, 'id' | 'name' | 'icon_url' | 'type'> & { role: 'owner' | 'member' };

export const groupsApi = {
  getGroups: async (): Promise<Group[]> => {
    const { data, error } = await supabase
      .from('groups')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data ?? [];
  },

  getMembers: async (groupId: string): Promise<GroupMember[]> => {
    const { data, error } = await supabase
      .from('group_user')
      .select('role, users(id, name, icon_url, type)')
      .eq('group_id', groupId);
    if (error) throw error;
    return (data ?? []).map((row: any) => ({
      ...row.users,
      role: row.role,
    }));
  },

  updateMemberRole: async (groupId: string, userId: string, role: 'owner' | 'member') => {
    const { error } = await supabase
      .from('group_user')
      .update({ role })
      .eq('group_id', groupId)
      .eq('user_id', userId);
    if (error) throw error;
  },

  createGroup: async (name: string, memberIds: string[] = []): Promise<Group> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data: group, error: groupError } = await supabase
      .from('groups')
      .insert({ name, created_by: user.id })
      .select()
      .single();
    if (groupError) throw groupError;

    const members = [
      { group_id: group.id, user_id: user.id, role: 'owner' },
      ...memberIds.map((id) => ({ group_id: group.id, user_id: id, role: 'member' })),
    ];
    const { error: memberError } = await supabase.from('group_user').insert(members);
    if (memberError) throw memberError;

    return group;
  },
};
