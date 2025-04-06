/**
 * This script sets up the necessary tables in Supabase for the snake game
 * Run with: npm run setup-supabase or yarn setup-supabase
 */

import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

// Load environment variables from .env.development.local
dotenv.config({ path: '.env.development.local' })

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error(
    'Missing Supabase credentials. Make sure SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in .env.development.local'
  )
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

async function createTables() {
  console.log('Setting up Supabase tables...')

  // This SQL will be executed directly in Supabase
  const usersTableSQL = `
  -- Create users table if it doesn't exist
  CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    highest_score INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  );

  -- Create trigger to update updated_at automatically
  DROP TRIGGER IF EXISTS update_users_updated_at ON users;
  CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

  -- RLS (Row Level Security) Policies
  ALTER TABLE users ENABLE ROW LEVEL SECURITY;

  -- Policy to allow users to read their own data
  DROP POLICY IF EXISTS "Users can read their own data" ON users;
  CREATE POLICY "Users can read their own data" ON users
    FOR SELECT
    USING (auth.uid() = id);

  -- Policy to allow users to update their own data
  DROP POLICY IF EXISTS "Users can update their own data" ON users;
  CREATE POLICY "Users can update their own data" ON users
    FOR UPDATE
    USING (auth.uid() = id);

  -- Policy to allow authenticated users to read the leaderboard
  DROP POLICY IF EXISTS "Anyone can read leaderboard data" ON users;
  CREATE POLICY "Anyone can read leaderboard data" ON users
    FOR SELECT
    USING (true);

  -- Policy to allow service role to do anything
  DROP POLICY IF EXISTS "Service role can do anything" ON users;
  CREATE POLICY "Service role can do anything" ON users
    USING (true)
    WITH CHECK (true);
  `

  // Create the updated_at function if it doesn't exist
  const updateFuncSQL = `
  CREATE OR REPLACE FUNCTION public.update_updated_at_column()
  RETURNS TRIGGER AS $$
  BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
  END;
  $$ LANGUAGE plpgsql;
  `

  try {
    // Create the updated_at function first
    const { error: funcError } = await supabase.rpc('pgclient', { query: updateFuncSQL })
    if (funcError) {
      console.error('Error creating updated_at function:', funcError)
    } else {
      console.log('Created or updated the updated_at function')
    }

    // Create the users table and policies
    const { error: tableError } = await supabase.rpc('pgclient', { query: usersTableSQL })
    if (tableError) {
      console.error('Error creating users table:', tableError)
    } else {
      console.log('Users table and policies set up successfully')
    }

    console.log('Setup complete!')
  } catch (error) {
    console.error('Error setting up tables:', error)
  }
}

createTables()
  .catch(console.error)
  .finally(() => process.exit(0))
