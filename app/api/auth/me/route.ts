import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '../lib/dbConnect'
import User from '../models/User'
import { requireAuth } from '../lib/jwt'

export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    // Check authentication
    const user = await requireAuth(req)

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await dbConnect()

    // Find user in DB to get up-to-date info including the latest score
    const dbUser = await User.findById(user.userId).select('-password')

    if (!dbUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      user: {
        id: dbUser._id,
        username: dbUser.username,
        email: dbUser.email,
        highestScore: dbUser.highestScore,
      },
    })
  } catch (error) {
    console.error('Get profile error:', error)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
