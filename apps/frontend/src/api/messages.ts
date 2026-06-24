import { supabase } from '@/lib/supabase';
import type { Message } from '@/types';

export const messagesApi = {
  getMessages: async (groupId: string): Promise<Message[]> => {
    const { data, error } = await supabase
      .from('messages')
      .select('*, user:users(id, name, icon_url)')
      .eq('group_id', groupId)
      .order('created_at', { ascending: true });
    if (error) throw error;
    return data ?? [];
  },

  sendMessage: async (groupId: string, body: string): Promise<Message> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');
    const { data, error } = await supabase
      .from('messages')
      .insert({ group_id: groupId, user_id: user.id, body })
      .select('*, user:users(id, name, icon_url)')
      .single();
    if (error) throw error;
    return data;
  },
};
