import { supabase } from '@/lib/supabase';
import type { Employee, NewGraduate, User, UserType } from '@/types';

// icon_url を含む拡張版（add member ビューで Avatar 表示に使用）
export type UserSummary = { id: string; name: string; type: UserType; icon_url: string | null; has_group: boolean };
export type UserBasic = Pick<User, 'id' | 'name' | 'type' | 'icon_url'>;

export const usersApi = {
  getAllBasic: async (): Promise<UserBasic[]> => {
    const { data, error } = await supabase
      .from('users')
      .select('id, name, type, icon_url')
      .order('name');
    if (error) throw error;
    return data ?? [];
  },

  // has_group + icon_url を返す（RPC + users テーブルをマージ）
  getAll: async (): Promise<UserSummary[]> => {
    const [{ data: statusData, error: statusError }, { data: iconData }] = await Promise.all([
      supabase.rpc('get_users_with_group_status'),
      supabase.from('users').select('id, icon_url'),
    ]);
    if (statusError) throw statusError;

    const iconMap = new Map<string, string | null>(
      (iconData ?? []).map((u: { id: string; icon_url: string | null }) => [u.id, u.icon_url])
    );
    return (statusData ?? []).map((u: Omit<UserSummary, 'icon_url'>) => ({
      ...u,
      icon_url: iconMap.get(u.id) ?? null,
    }));
  },

  getNewGraduates: async (): Promise<NewGraduate[]> => {
    const { data, error } = await supabase
      .from('users')
      .select('id, name, icon_url, comment')
      .eq('type', 'new_graduate')
      .order('created_at');
    if (error) throw error;
    return data ?? [];
  },

  getEmployees: async (): Promise<Employee[]> => {
    const { data, error } = await supabase
      .from('users')
      .select('id, name, icon_url, comment, department, position')
      .eq('type', 'employee')
      .order('created_at');
    if (error) throw error;
    return data ?? [];
  },
};
