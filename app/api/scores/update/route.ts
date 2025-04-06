import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '../../auth/lib/jwt'
import { supabaseAdmin, checkEnvVars } from '../../lib/supabase'

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    // Check environment variables
    checkEnvVars()

    // Check authentication
    const user = await requireAuth(req)

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { score } = body

    // Validate score
    if (typeof score !== 'number' || score < 0) {
      return NextResponse.json({ error: 'Invalid score' }, { status: 400 })
    }

    // Get the current user from Supabase
    const { data: dbUser, error: userError } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('id', user.userId)
      .single()

    if (userError || !dbUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Only update if the new score is higher
    if (score > dbUser.highest_score) {
      // Update the highest score
      const { error: updateError } = await supabaseAdmin
        .from('users')
        .update({ highest_score: score })
        .eq('id', user.userId)

      if (updateError) {
        console.error('Error updating score:', updateError)
        return NextResponse.json({ error: 'Failed to update score' }, { status: 500 })
      }

      return NextResponse.json({
        success: true,
        message: 'New high score!',
        highestScore: score,
      })
    }

    // Return current highest score if no update was necessary
    return NextResponse.json({
      success: true,
      message: 'Score recorded but not a new high score',
      highestScore: dbUser.highest_score,
    })
  } catch (error) {
    console.error('Update score error:', error)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
