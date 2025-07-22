import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { amount, currency = 'usd' } = await req.json()
    
    console.log('Payment intent request:', { amount, currency })
    
    if (!amount || amount <= 0) {
      console.log('Invalid amount:', amount)
      return NextResponse.json(
        { error: 'Invalid amount' },
        { status: 400 }
      )
    }
    
    if (!process.env.STRIPE_TEST_SECRET_KEY) {
      console.error('STRIPE_TEST_SECRET_KEY is not set')
      return NextResponse.json(
        { error: 'Stripe not configured' },
        { status: 500 }
      )
    }
    
    console.log('Creating payment intent with Stripe...')
    
    // Create payment intent with Stripe
    const params = new URLSearchParams({
      amount: (amount * 100).toString(), // Convert to cents
      currency: currency.toLowerCase(),
      capture_method: 'automatic',
    })
    
    // Add array parameter correctly
    params.append('payment_method_types[]', 'card_present')
    
    const response = await fetch('https://api.stripe.com/v1/payment_intents', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.STRIPE_TEST_SECRET_KEY}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params,
    })
    
    console.log('Stripe response status:', response.status)
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error('Stripe API error:', errorText)
      throw new Error(`Stripe API error: ${response.status} - ${errorText}`)
    }
    
    const paymentIntent = await response.json()
    
    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    })
  } catch (error) {
    console.error('Error creating payment intent:', error)
    return NextResponse.json(
      { error: 'Failed to create payment intent' },
      { status: 500 }
    )
  }
}