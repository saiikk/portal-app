import type { User } from './user';

export interface Message {
  id: number;
  group_id: string;
  user_id: string;
  body: string;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
  user: User;
}
