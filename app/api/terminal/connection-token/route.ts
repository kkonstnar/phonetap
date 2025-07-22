import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    console.log('Creating connection token...')
    
    if (!process.env.STRIPE_TEST_SECRET_KEY) {
      console.error('STRIPE_TEST_SECRET_KEY is not set')
      return NextResponse.json(
        { error: 'Stripe not configured' },
        { status: 500 }
      )
    }
    
    const response = await fetch('https://api.stripe.com/v1/terminal/connection_tokens', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.STRIPE_TEST_SECRET_KEY}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
    
    console.log('Connection token response status:', response.status)
    
    if (!response.ok) {
      throw new Error('Failed to create connection token')
    }
    
    const { secret } = await response.json()
    
    return NextResponse.json({ secret })
  } catch (error) {
    console.error('Error creating connection token:', error)
    return NextResponse.json(
      { error: 'Failed to create connection token' },
      { status: 500 }
    )
  }
}