// types/index.ts
export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  address?: string;
  contact_number?: string;
  birthday?: string;
  profile_image?: string;
  bio?: string;
}

export interface Todo {
  id: number;
  title: string;
  description: string;
  priority: 'extreme' | 'moderate' | 'low';
  is_completed: boolean;
  position: number;
  todo_date: string; // YYYY-MM-DD
  created_at: string;
  updated_at: string;
}

export interface AuthTokens {
  access: string;
  refresh: string;
}