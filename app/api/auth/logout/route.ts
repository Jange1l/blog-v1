import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    // Create response
    const response = NextResponse.json({ success: true })

    // Clear auth cookie
    response.cookies.set({
      name: 'token',
      value: '',
      httpOnly: true,
      expires: new Date(0), // Expire immediately
      path: '/',
    })

    return response
  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
