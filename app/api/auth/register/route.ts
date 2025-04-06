import { NextRequest, NextResponse } from 'next/server'
import { createToken, setTokenCookie } from '../lib/jwt'
import { supabaseAdmin, checkEnvVars } from '../../lib/supabase'
import bcrypt from 'bcryptjs'

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    // Check environment variables
    checkEnvVars()

    const body = await req.json()
    const { username, email, password } = body

    // Basic validation
    if (!username || !email || !password) {
      return NextResponse.json({ error: 'Please provide all required fields' }, { status: 400 })
    }

    // Check if user already exists by email
    const { data: emailUser } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('email', email)
      .single()

    // Check if user already exists by username
    const { data: usernameUser } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('username', username)
      .single()

    if (emailUser || usernameUser) {
      return NextResponse.json(
        { error: 'User with this email or username already exists' },
        { status: 400 }
      )
    }

    // Hash password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    // Use Supabase Auth to create a user
    const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    })

    if (authError) {
      console.error('Supabase Auth error:', authError)
      return NextResponse.json({ error: authError.message }, { status: 400 })
    }

    // Now create the user profile in the users table
    const { data: user, error: profileError } = await supabaseAdmin
      .from('users')
      .insert({
        id: authUser.user.id,
        username,
        email,
        highest_score: 0,
      })
      .select()
      .single()

    if (profileError) {
      console.error('User profile creation error:', profileError)
      // Clean up the auth user if profile creation fails
      await supabaseAdmin.auth.admin.deleteUser(authUser.user.id)
      return NextResponse.json({ error: 'Failed to create user profile' }, { status: 500 })
    }

    // Create JWT token
    const token = createToken({
      userId: user.id,
      username: user.username,
      email: user.email,
    })

    // Create response
    const response = NextResponse.json(
      {
        success: true,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          highestScore: user.highest_score,
        },
      },
      { status: 201 }
    )

    // Set cookie with token
    setTokenCookie(response, token)

    return response
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
