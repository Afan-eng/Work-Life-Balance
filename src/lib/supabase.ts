import { createClient } from '@supabase/supabase-js';

// Environment variables or fallback dummy values for local preview
export const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://mock-balance-studio.supabase.co';
export const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.mock-anon-key-balance-studio-2026';

export const isSupabaseConfigured = Boolean(
  import.meta.env.VITE_SUPABASE_URL && 
  import.meta.env.VITE_SUPABASE_ANON_KEY && 
  !import.meta.env.VITE_SUPABASE_URL.includes('mock-balance')
);

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

export interface UserStreakRecord {
  id?: string;
  user_id: string;
  current_streak: number;
  best_streak: number;
  freeze_tokens: number;
  last_activity_date: string;
  completion_matrix: Record<string, boolean>; // e.g. { '2026-10-25': true }
  created_at?: string;
  updated_at?: string;
}

export interface UserHabitRecord {
  id: string;
  user_id: string;
  title: string;
  category: 'mind' | 'body' | 'focus' | 'rest';
  frequency: 'daily' | 'weekdays' | 'weekend';
  streak: number;
  completed_today: boolean;
  history: string[]; // dates array
  created_at?: string;
}

export interface UserGoalRecord {
  id: string;
  user_id: string;
  title: string;
  category: 'Career' | 'Physical' | 'Mental' | 'Relationships';
  target_date: string;
  progress: number; // 0 to 100
  milestones: { id: string; title: string; completed: boolean }[];
  status: 'active' | 'completed' | 'paused';
  created_at?: string;
}

export interface UserMoodLogRecord {
  id: string;
  user_id: string;
  score: number; // 1 to 5
  label: string; // 'Drained', 'Low', 'Balanced', 'Energized', 'Thriving'
  tags: string[];
  note: string;
  created_at: string;
}

export interface ChatThreadRecord {
  id: string;
  user_id: string;
  title: string;
  created_at: string;
  updated_at: string;
}

export interface ChatMessageRecord {
  id: string;
  thread_id: string;
  user_id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  created_at: string;
}

export interface PaymentRecord {
  id: string;
  user_id: string;
  razorpay_order_id: string;
  razorpay_payment_id?: string;
  amount: number;
  currency: string;
  item_type: 'subscription' | 'workshop_pass';
  item_name: string;
  status: 'created' | 'paid' | 'failed';
  created_at: string;
}
