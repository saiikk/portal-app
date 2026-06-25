import { supabase } from '@/lib/supabase';

export type Notification = {
  id: string;
  user_id: string;
  type: string;
  message: string;
  read: boolean;
  created_at: string;
};

export const notificationsApi = {
  getUnread: async (): Promise<Notification[]> => {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('read', false)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data ?? [];
  },

  markRead: async (id: string): Promise<void> => {
    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', id);
    if (error) throw error;
  },
};
