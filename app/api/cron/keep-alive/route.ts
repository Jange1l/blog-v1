import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin, checkEnvVars } from '../../lib/supabase'

// This endpoint is designed to be called by a cron job service like Vercel Cron
export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    // Validate this request is from our cron job
    // You can add a custom header check or token validation if needed

    // Check environment variables
    checkEnvVars()

    // Perform a lightweight query to keep Supabase active
    const { data, error } = await supabaseAdmin.from('users').select('id').limit(1)

    if (error) {
      console.error('Cron keep-alive error:', error)
      return NextResponse.json({ status: 'error', message: error.message }, { status: 500 })
    }

    console.log('Cron keep-alive ping successful')

    return NextResponse.json({
      status: 'ok',
      message: 'Supabase keep-alive ping successful',
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Cron keep-alive error:', error)
    return NextResponse.json(
      {
        status: 'error',
        message: 'Failed to ping Supabase',
      },
      { status: 500 }
    )
  }
}
