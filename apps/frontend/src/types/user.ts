export type UserType = 'new_graduate' | 'employee';
export type UserRole = 'general' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  icon_url: string | null;
  comment: string | null;
  type: UserType;
  role: UserRole;
  department: string | null;
  position: string | null;
  created_at: string;
  updated_at: string;
}

export interface NewGraduate {
  id: string;
  name: string;
  icon_url: string | null;
  comment: string | null;
}

export interface Employee {
  id: string;
  name: string;
  icon_url: string | null;
  comment: string | null;
  department: string | null;
  position: string | null;
}
