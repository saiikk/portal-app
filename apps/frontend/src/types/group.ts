import type { User } from './user';

export interface Group {
  id: string;
  name: string;
  created_by: string;
  creator?: User;
  created_at: string;
  updated_at: string;
}
