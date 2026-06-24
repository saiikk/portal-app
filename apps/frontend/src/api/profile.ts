import { supabase } from '@/lib/supabase';
import type { User } from '@/types';

export interface UpdateProfilePayload {
  name?: string;
  email?: string;
}

export const profileApi = {
  updateProfile: async (payload: UpdateProfilePayload): Promise<User> => {
    const { data: { user: authUser } } = await supabase.auth.getUser();
    if (!authUser) throw new Error('Not authenticated');
    const { data, error } = await supabase
      .from('users')
      .update(payload)
      .eq('id', authUser.id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  // Session 6 で Supabase Storage に移行予定
  uploadAvatar: async (_formData: FormData): Promise<User> => {
    throw new Error('uploadAvatar は Session 6 で実装');
  },
};
