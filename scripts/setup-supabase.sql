-- This SQL script sets up the necessary tables and functions for the snake game
-- Run this script in the Supabase SQL editor

-- Create the updated_at function if it doesn't exist
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create users table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  highest_score INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create trigger to update updated_at automatically
DROP TRIGGER IF EXISTS update_users_updated_at ON public.users;
CREATE TRIGGER update_users_updated_at
BEFORE UPDATE ON public.users
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- RLS (Row Level Security) Policies
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Policy to allow users to read their own data
DROP POLICY IF EXISTS "Users can read their own data" ON public.users;
CREATE POLICY "Users can read their own data" ON public.users
  FOR SELECT
  USING (auth.uid() = id);

-- Policy to allow users to update their own data
DROP POLICY IF EXISTS "Users can update their own data" ON public.users;
CREATE POLICY "Users can update their own data" ON public.users
  FOR UPDATE
  USING (auth.uid() = id);

-- Policy to allow authenticated users to read the leaderboard
DROP POLICY IF EXISTS "Anyone can read leaderboard data" ON public.users;
CREATE POLICY "Anyone can read leaderboard data" ON public.users
  FOR SELECT
  USING (true);

-- Policy to allow service role to do anything
DROP POLICY IF EXISTS "Service role can do anything" ON public.users;
CREATE POLICY "Service role can do anything" ON public.users
  USING (true)
  WITH CHECK (true);

-- Allow the service role to create records
DROP POLICY IF EXISTS "Service role can insert data" ON public.users;
CREATE POLICY "Service role can insert data" ON public.users
  FOR INSERT
  WITH CHECK (true); 