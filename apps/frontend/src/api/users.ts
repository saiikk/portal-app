import { supabase } from '@/lib/supabase';
import type { Employee, NewGraduate, UserType } from '@/types';

export type UserSummary = { id: string; name: string; type: UserType; has_group: boolean };

export const usersApi = {
  getAll: async (): Promise<UserSummary[]> => {
    const { data, error } = await supabase.rpc('get_users_with_group_status');
    if (error) throw error;
    return data ?? [];
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
