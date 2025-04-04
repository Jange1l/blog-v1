import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '../lib/dbConnect'
import User from '../models/User'
import { createToken, setTokenCookie } from '../lib/jwt'

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    await dbConnect()

    const body = await req.json()
    const { username, email, password } = body

    // Basic validation
    if (!username || !email || !password) {
      return NextResponse.json({ error: 'Please provide all required fields' }, { status: 400 })
    }

    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] })

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email or username already exists' },
        { status: 400 }
      )
    }

    // Create new user
    const user = await User.create({ username, email, password })

    // Create JWT token
    const token = createToken({
      userId: user._id.toString(),
      username: user.username,
      email: user.email,
    })

    // Create response
    const response = NextResponse.json(
      {
        success: true,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          highestScore: user.highestScore,
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
