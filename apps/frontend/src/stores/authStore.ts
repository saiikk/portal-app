import { create } from 'zustand';

import { supabase } from '@/lib/supabase';
import type { User } from '@/types';

interface AuthStore {
  user: User | null;
  isLoading: boolean;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
  initialize: () => void;
  setUser: (user: User) => void;
}

async function fetchProfile(userId: string): Promise<User | null> {
  const { data } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();
  return data;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isLoading: true,

  login: async ({ email, password }) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  },

  logout: async () => {
    await supabase.auth.signOut();
    set({ user: null });
  },

  setUser: (user) => set({ user }),

  initialize: () => {
    supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        const profile = await fetchProfile(session.user.id);
        set({ user: profile, isLoading: false });
      } else {
        set({ user: null, isLoading: false });
      }
    });
  },
}));
