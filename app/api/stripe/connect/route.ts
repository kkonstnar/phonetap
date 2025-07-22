import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { email, name } = await req.json()
    
    if (!process.env.STRIPE_TEST_SECRET_KEY) {
      console.error('STRIPE_TEST_SECRET_KEY is not set')
      return NextResponse.json(
        { error: 'Stripe not configured' },
        { status: 500 }
      )
    }

    // Create a Stripe Connect account
    const accountResponse = await fetch('https://api.stripe.com/v1/accounts', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.STRIPE_TEST_SECRET_KEY}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        type: 'custom',
        country: 'JM',
        email: email || '',
        'capabilities[transfers][requested]': 'true',
        'tos_acceptance[service_agreement]': 'recipient',
      }),
    })

    if (!accountResponse.ok) {
      const errorText = await accountResponse.text()
      console.error('Failed to create Stripe account:', errorText)
      return NextResponse.json(
        { error: 'Failed to create Stripe account' },
        { status: 500 }
      )
    }

    const account = await accountResponse.json()
    console.log('Created Stripe account:', account.id)

    // Create account link for onboarding
    const linkResponse = await fetch('https://api.stripe.com/v1/account_links', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.STRIPE_TEST_SECRET_KEY}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        account: account.id,
        refresh_url: `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/getpaid?refresh=true`,
        return_url: `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/getpaid?success=true`,
        type: 'account_onboarding',
        collect: 'eventually_due',
      }),
    })

    if (!linkResponse.ok) {
      const errorText = await linkResponse.text()
      console.error('Failed to create account link:', errorText)
      return NextResponse.json(
        { error: 'Failed to create onboarding link' },
        { status: 500 }
      )
    }

    const link = await linkResponse.json()
    console.log('Created account link:', link.url)

    return NextResponse.json({ 
      accountId: account.id,
      onboardingUrl: link.url
    })

  } catch (error) {
    console.error('Error setting up Stripe Connect:', error)
    return NextResponse.json(
      { error: 'Stripe Connect setup failed' },
      { status: 500 }
    )
  }
}