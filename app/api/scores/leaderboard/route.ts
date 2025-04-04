import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '../../auth/lib/dbConnect'
import User from '../../auth/models/User'

export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    await dbConnect()

    // Get the top 10 scores
    const limit = 10

    // Query users sorted by highestScore in descending order
    const topUsers = await User.find({ highestScore: { $gt: 0 } })
      .select('username highestScore')
      .sort({ highestScore: -1 })
      .limit(limit)

    // Format the response
    const leaderboard = topUsers.map((user, index) => ({
      rank: index + 1,
      username: user.username,
      score: user.highestScore,
    }))

    return NextResponse.json({
      success: true,
      leaderboard,
    })
  } catch (error) {
    console.error('Leaderboard error:', error)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
