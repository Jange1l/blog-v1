import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin, checkEnvVars } from '../../lib/supabase'

export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    // Check environment variables
    checkEnvVars()

    // Get the top 20 scores
    const limit = 20

    // Query users sorted by highest_score in descending order
    const { data: topUsers, error } = await supabaseAdmin
      .from('users')
      .select('username, highest_score')
      .gt('highest_score', 0)
      .order('highest_score', { ascending: false })
      .limit(limit)

    if (error) {
      console.error('Error fetching leaderboard:', error)
      return NextResponse.json({ error: 'Failed to fetch leaderboard' }, { status: 500 })
    }

    console.log('Top Users: ', topUsers)
    // Format the response
    const leaderboard = topUsers.map((user, index) => ({
      rank: index + 1,
      username: user.username,
      score: user.highest_score,
    }))

    // Create response with cache control headers to prevent caching
    const response = NextResponse.json({
      success: true,
      leaderboard,
    })

    // Add cache control headers to prevent caching
    response.headers.set('Cache-Control', 'no-store, max-age=0')
    response.headers.set('Pragma', 'no-cache')
    response.headers.set('Expires', '0')

    return response
  } catch (error) {
    console.error('Leaderboard error:', error)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
