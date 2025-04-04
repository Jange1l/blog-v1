import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '../../auth/lib/dbConnect'
import User from '../../auth/models/User'
import { requireAuth } from '../../auth/lib/jwt'

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
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

    await dbConnect()

    // Find user and update highest score if the new score is higher
    const dbUser = await User.findById(user.userId)

    if (!dbUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Only update if the new score is higher
    if (score > dbUser.highestScore) {
      dbUser.highestScore = score
      await dbUser.save()

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
      highestScore: dbUser.highestScore,
    })
  } catch (error) {
    console.error('Update score error:', error)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
