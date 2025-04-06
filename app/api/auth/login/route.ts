import { NextRequest, NextResponse } from 'next/server'
import { createToken, setTokenCookie } from '../lib/jwt'
import { supabaseAdmin, checkEnvVars } from '../../lib/supabase'

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    // Check environment variables
    checkEnvVars()

    const body = await req.json()
    const { email, password } = body

    // Basic validation
    if (!email || !password) {
      return NextResponse.json({ error: 'Please provide email and password' }, { status: 400 })
    }

    // Use Supabase Auth to sign in
    const { data: authData, error: authError } = await supabaseAdmin.auth.signInWithPassword({
      email,
      password,
    })

    if (authError) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    // Get the user profile from the users table
    const { data: user, error: userError } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('id', authData.user.id)
      .single()

    if (userError || !user) {
      return NextResponse.json({ error: 'User profile not found' }, { status: 404 })
    }

    // Create JWT token
    const token = createToken({
      userId: user.id,
      username: user.username,
      email: user.email,
    })

    // Create response
    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        highestScore: user.highest_score,
      },
    })

    // Set cookie with token
    setTokenCookie(response, token)

    return response
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
