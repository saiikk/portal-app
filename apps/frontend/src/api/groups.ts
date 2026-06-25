import { supabase } from '@/lib/supabase';
import type { Group, User } from '@/types';

export type GroupMember = Pick<User, 'id' | 'name' | 'icon_url' | 'type'> & { role: 'owner' | 'member' };

export const groupsApi = {
  // 自分が参加しているグループのみ返す
  getGroups: async (): Promise<Group[]> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('group_user')
      .select('groups(*)')
      .eq('user_id', user.id);
    if (error) throw error;

    const groups = (data ?? []).map((row: any) => row.groups as Group).filter(Boolean);
    return groups.sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  },

  getGroup: async (groupId: string): Promise<Group | null> => {
    const { data, error } = await supabase
      .from('groups')
      .select('*')
      .eq('id', groupId)
      .single();
    if (error) return null;
    return data;
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

  kickMember: async (groupId: string, userId: string, groupName: string): Promise<void> => {
    // SECURITY DEFINER RPC でオーナー確認 + RLS を迂回して削除
    const { error: kickError } = await supabase.rpc('kick_member', {
      p_group_id: groupId,
      p_user_id: userId,
    });
    if (kickError) throw kickError;

    await supabase
      .from('notifications')
      .insert({
        user_id: userId,
        type: 'group_kick',
        message: `「${groupName}」グループから退出されました。`,
      })
      .then(({ error }) => { if (error) console.warn('[kickMember] notification insert failed:', error.message); });
  },

  createGroup: async (name: string, memberIds: string[] = []): Promise<Group> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const id = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
    });

    const { data: group, error: groupError } = await supabase
      .from('groups')
      .insert({ id, name, created_by: user.id })
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
