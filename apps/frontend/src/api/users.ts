import { supabase } from '@/lib/supabase';
import type { Employee, NewGraduate, User, UserType } from '@/types';

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
