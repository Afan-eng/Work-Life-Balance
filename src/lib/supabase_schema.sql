-- ====================================================================
-- BALANCE STUDIO: SUPABASE POSTGRESQL SCHEMA WITH ROW LEVEL SECURITY
-- Run this script in the Supabase SQL Editor to initialize all tables
-- ====================================================================

-- 1. Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. User Streaks Table
CREATE TABLE IF NOT EXISTS public.user_streaks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
    current_streak INTEGER DEFAULT 1,
    best_streak INTEGER DEFAULT 1,
    freeze_tokens INTEGER DEFAULT 2,
    last_activity_date DATE DEFAULT CURRENT_DATE,
    completion_matrix JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for user_streaks
ALTER TABLE public.user_streaks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own streak record" 
    ON public.user_streaks FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own streak record" 
    ON public.user_streaks FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own streak record" 
    ON public.user_streaks FOR UPDATE 
    USING (auth.uid() = user_id);

-- 3. User Habits Table
CREATE TABLE IF NOT EXISTS public.user_habits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('mind', 'body', 'focus', 'rest')),
    frequency TEXT NOT NULL DEFAULT 'daily',
    streak INTEGER DEFAULT 0,
    completed_today BOOLEAN DEFAULT false,
    history JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for user_habits
ALTER TABLE public.user_habits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own habits" 
    ON public.user_habits FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own habits" 
    ON public.user_habits FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own habits" 
    ON public.user_habits FOR UPDATE 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own habits" 
    ON public.user_habits FOR DELETE 
    USING (auth.uid() = user_id);

-- 4. User Goals Table
CREATE TABLE IF NOT EXISTS public.user_goals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('Career', 'Physical', 'Mental', 'Relationships')),
    target_date DATE NOT NULL,
    progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
    milestones JSONB DEFAULT '[]'::jsonb,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'paused')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for user_goals
ALTER TABLE public.user_goals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own goals" 
    ON public.user_goals FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own goals" 
    ON public.user_goals FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own goals" 
    ON public.user_goals FOR UPDATE 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own goals" 
    ON public.user_goals FOR DELETE 
    USING (auth.uid() = user_id);

-- 5. User Mood Logs Table
CREATE TABLE IF NOT EXISTS public.user_mood_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    score INTEGER NOT NULL CHECK (score >= 1 AND score <= 5),
    label TEXT NOT NULL,
    tags JSONB DEFAULT '[]'::jsonb,
    note TEXT DEFAULT '',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for user_mood_logs
ALTER TABLE public.user_mood_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own mood logs" 
    ON public.user_mood_logs FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own mood logs" 
    ON public.user_mood_logs FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own mood logs" 
    ON public.user_mood_logs FOR DELETE 
    USING (auth.uid() = user_id);

-- 6. Chat Threads Table (Balance Guide AI)
CREATE TABLE IF NOT EXISTS public.chat_threads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL DEFAULT 'Mindfulness Conversation',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for chat_threads
ALTER TABLE public.chat_threads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own chat threads" 
    ON public.chat_threads FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create chat threads" 
    ON public.chat_threads FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own chat threads" 
    ON public.chat_threads FOR DELETE 
    USING (auth.uid() = user_id);

-- 7. Chat Messages Table
CREATE TABLE IF NOT EXISTS public.chat_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    thread_id UUID REFERENCES public.chat_threads(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for chat_messages
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view messages from their threads" 
    ON public.chat_messages FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert messages to their threads" 
    ON public.chat_messages FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

-- 8. Payments Table (Razorpay Orders & Statuses)
CREATE TABLE IF NOT EXISTS public.payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    razorpay_order_id TEXT NOT NULL,
    razorpay_payment_id TEXT,
    amount NUMERIC NOT NULL,
    currency TEXT DEFAULT 'INR',
    item_type TEXT NOT NULL CHECK (item_type IN ('subscription', 'workshop_pass')),
    item_name TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'created' CHECK (status IN ('created', 'paid', 'failed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for payments
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own payment history" 
    ON public.payments FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Service roles & users can insert payments" 
    ON public.payments FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

-- Indexes for lightning fast queries
CREATE INDEX IF NOT EXISTS idx_habits_user ON public.user_habits(user_id);
CREATE INDEX IF NOT EXISTS idx_goals_user ON public.user_goals(user_id);
CREATE INDEX IF NOT EXISTS idx_mood_user ON public.user_mood_logs(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_chat_messages_thread ON public.chat_messages(thread_id, created_at ASC);
CREATE INDEX IF NOT EXISTS idx_payments_user ON public.payments(user_id);
