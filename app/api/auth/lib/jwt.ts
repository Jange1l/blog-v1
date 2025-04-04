import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

// Type for decoded JWT token
export interface JwtPayload {
  userId: string
  username: string
  email: string
}

// Token creation
export const createToken = (payload: JwtPayload): string => {
  const secret = process.env.JWT_SECRET

  if (!secret) {
    throw new Error('JWT_SECRET is not defined in environment variables')
  }

  // Increase token expiration to 30 days for longer user sessions
  return jwt.sign(payload, secret, { expiresIn: '30d' })
}

// Set token as HTTP-only cookie
export const setTokenCookie = (res: NextResponse, token: string): void => {
  // Set token as HTTP-only cookie
  res.cookies.set({
    name: 'token',
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 30, // 30 days to match JWT expiration
    path: '/',
    sameSite: 'strict',
  })
}

// Get token from cookies
export const getTokenFromCookies = (): string | undefined => {
  return cookies().get('token')?.value
}

// Verify token
export const verifyToken = (token: string): JwtPayload => {
  const secret = process.env.JWT_SECRET

  if (!secret) {
    throw new Error('JWT_SECRET is not defined in environment variables')
  }

  try {
    return jwt.verify(token, secret) as JwtPayload
  } catch (error) {
    throw new Error('Invalid token')
  }
}

// Get current user data from token in cookies
export const getCurrentUser = (): JwtPayload | null => {
  try {
    const token = getTokenFromCookies()
    if (!token) return null

    return verifyToken(token)
  } catch (error) {
    console.error('Error getting current user:', error)
    return null
  }
}

// Middleware to verify authentication
export const requireAuth = async (req: NextRequest): Promise<JwtPayload | null> => {
  try {
    const token = req.cookies.get('token')?.value

    if (!token) {
      return null
    }

    return verifyToken(token)
  } catch (error) {
    console.error('Auth middleware error:', error)
    return null
  }
}
