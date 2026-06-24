import type { User } from './user';

export interface Message {
  id: string;
  group_id: string;
  user_id: string;
  body: string;
  created_at: string;
  user?: Pick<User, 'id' | 'name' | 'icon_url'>;
}
