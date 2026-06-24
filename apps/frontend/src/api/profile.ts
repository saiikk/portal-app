import { Platform } from 'react-native';

import { supabase } from '@/lib/supabase';
import type { User } from '@/types';

export interface UpdateProfilePayload {
  name?: string;
  email?: string;
}

export interface AvatarAsset {
  uri: string;
  mimeType?: string;
  file?: File;
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

  uploadAvatar: async (asset: AvatarAsset): Promise<User> => {
    const { data: { user: authUser } } = await supabase.auth.getUser();
    if (!authUser) throw new Error('Not authenticated');

    const ext = asset.uri.split('.').pop()?.toLowerCase() ?? 'jpg';
    const path = `${authUser.id}/avatar.${ext}`;
    const contentType = asset.mimeType ?? 'image/jpeg';

    let fileData: File | ArrayBuffer;
    if (Platform.OS === 'web' && asset.file) {
      fileData = asset.file;
    } else {
      const response = await fetch(asset.uri);
      fileData = await response.arrayBuffer();
    }

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(path, fileData, { contentType, upsert: true });
    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('avatars')
      .getPublicUrl(path);

    // キャッシュバスター付きで保存
    const iconUrl = `${publicUrl}?t=${Date.now()}`;

    const { data, error } = await supabase
      .from('users')
      .update({ icon_url: iconUrl })
      .eq('id', authUser.id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },
};
