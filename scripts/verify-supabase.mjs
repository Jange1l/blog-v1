/**
 * This script verifies the Supabase connection
 * Run with: yarn verify-supabase
 */

import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'
import { existsSync } from 'fs'

// Get directory of current file
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Find and load the correct env file
const envPaths = [
  resolve(__dirname, '..', '.env.development.local'),
  resolve(__dirname, '..', '.env.local'),
  resolve(__dirname, '..', '.env'),
]

let envFile = envPaths.find((path) => existsSync(path))

if (envFile) {
  console.log(`Loading environment from ${envFile}`)
  dotenv.config({ path: envFile })
} else {
  console.log('No environment file found, using process.env')
  dotenv.config()
}

// Check for required environment variables
const requiredEnvVars = [
  'SUPABASE_URL',
  'SUPABASE_SERVICE_ROLE_KEY',
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'JWT_SECRET',
]

const missingVars = requiredEnvVars.filter((varName) => !process.env[varName])

if (missingVars.length > 0) {
  console.error('Missing required environment variables:', missingVars.join(', '))
  process.exit(1)
}

console.log('All required environment variables are set!')

// Create Supabase client for testing
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

// Test the connection
async function testConnection() {
  try {
    console.log('Testing Supabase connection...')

    // Test auth by checking if we can get user count
    const { count, error: authError } = await supabase.auth.admin.listUsers({
      perPage: 1,
    })

    if (authError) {
      throw new Error(`Auth error: ${authError.message}`)
    }

    console.log(`Successfully connected to Supabase Auth! User count: ${count}`)

    // Check if the users table exists by trying to count records
    const { count: tableCount, error: tableError } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })

    if (tableError) {
      if (tableError.code === '42P01') {
        // Table doesn't exist code
        console.log('\nThe "users" table does not exist yet. Please run the SQL setup script.')
        console.log('You can find the SQL in: scripts/setup-supabase.sql')
        console.log('Copy this SQL and run it in the Supabase SQL Editor.')
      } else {
        console.error('\nError checking users table:', tableError)
      }
    } else {
      console.log(`Successfully connected to the "users" table! Row count: ${tableCount}`)
    }

    console.log('\nConnection verification complete!')
  } catch (error) {
    console.error('Connection error:', error)
  }
}

testConnection()
  .catch(console.error)
  .finally(() => process.exit(0))
