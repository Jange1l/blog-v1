import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '../lib/dbConnect'
import User from '../models/User'
import { createToken, setTokenCookie } from '../lib/jwt'

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    await dbConnect()

    const body = await req.json()
    const { email, password } = body

    // Basic validation
    if (!email || !password) {
      return NextResponse.json({ error: 'Please provide email and password' }, { status: 400 })
    }

    // Find user
    const user = await User.findOne({ email })

    // Check if user exists and password is correct
    if (!user || !(await user.comparePassword(password))) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    // Create JWT token
    const token = createToken({
      userId: user._id.toString(),
      username: user.username,
      email: user.email,
    })

    // Create response
    const response = NextResponse.json({
      success: true,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        highestScore: user.highestScore,
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
