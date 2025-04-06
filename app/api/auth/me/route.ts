import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '../lib/jwt'
import { supabaseAdmin, checkEnvVars } from '../../lib/supabase'

export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    // Check environment variables
    checkEnvVars()

    // Check authentication
    const user = await requireAuth(req)

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user from Supabase
    const { data: dbUser, error } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('id', user.userId)
      .single()

    if (error || !dbUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      user: {
        id: dbUser.id,
        username: dbUser.username,
        email: dbUser.email,
        highestScore: dbUser.highest_score,
      },
    })
  } catch (error) {
    console.error('Get profile error:', error)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
