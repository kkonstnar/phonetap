import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    console.log('Creating/getting location...')
    
    if (!process.env.STRIPE_TEST_SECRET_KEY) {
      console.error('STRIPE_TEST_SECRET_KEY is not set')
      return NextResponse.json(
        { error: 'Stripe not configured' },
        { status: 500 }
      )
    }

    // First, try to list existing locations
    const listResponse = await fetch('https://api.stripe.com/v1/terminal/locations?limit=1', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${process.env.STRIPE_TEST_SECRET_KEY}`,
      },
    })

    if (listResponse.ok) {
      const locations = await listResponse.json()
      console.log('List locations response:', locations)
      if (locations.data && locations.data.length > 0) {
        console.log('Using existing location:', locations.data[0].id)
        return NextResponse.json({ 
          locationId: locations.data[0].id,
          displayName: locations.data[0].display_name 
        })
      }
    } else {
      const listError = await listResponse.text()
      console.log('List locations failed:', listResponse.status, listError)
    }

    // If no locations exist, create one
    console.log('Creating new location...')
    const createResponse = await fetch('https://api.stripe.com/v1/terminal/locations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.STRIPE_TEST_SECRET_KEY}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        display_name: 'PhoneTap Test Location',
        'address[line1]': '123 Business St',
        'address[city]': 'San Francisco',
        'address[country]': 'US',
        'address[state]': 'CA',
        'address[postal_code]': '94102',
      }),
    })

    console.log('Create location response status:', createResponse.status)

    if (!createResponse.ok) {
      const errorText = await createResponse.text()
      console.error('Failed to create location:', errorText)
      return NextResponse.json(
        { error: 'Failed to create location' },
        { status: 500 }
      )
    }

    const location = await createResponse.json()
    console.log('Created location:', location.id)

    return NextResponse.json({ 
      locationId: location.id,
      displayName: location.display_name 
    })

  } catch (error) {
    console.error('Error with location:', error)
    return NextResponse.json(
      { error: 'Location setup failed' },
      { status: 500 }
    )
  }
}