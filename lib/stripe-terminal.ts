"use client"

declare global {
  interface Window {
    StripeTerminal: any;
  }
}

let terminal: any = null

async function fetchConnectionToken(): Promise<string> {
  // Your backend should call /v1/terminal/connection_tokens and return the JSON response from Stripe
  const response = await fetch('/api/terminal/connection-token', { 
    method: "POST" 
  });
  const data = await response.json();
  return data.secret;
}

function unexpectedDisconnect() {
  console.warn('Reader disconnected unexpectedly')
  // You might want to display UI to notify the user and start re-discovering readers
}

export const initializeStripeTerminal = async () => {
  if (typeof window === 'undefined') return null
  
  try {
    console.log('Device info:', {
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      isIOS: /iPad|iPhone|iPod/.test(navigator.userAgent),
      isSecure: window.location.protocol === 'https:',
      hasNFC: 'nfc' in navigator
    })
    
    if (!window.StripeTerminal) {
      console.error('Stripe Terminal SDK not loaded')
      return null
    }
    
    if (!terminal) {
      console.log('Creating Stripe Terminal instance...')
      terminal = window.StripeTerminal.create({
        onFetchConnectionToken: fetchConnectionToken,
        onUnexpectedReaderDisconnect: unexpectedDisconnect,
      })
      console.log('Stripe Terminal created successfully')
    }
    
    return terminal
  } catch (error) {
    console.error('Failed to initialize Stripe Terminal:', error)
    console.error('Error details:', error)
    return null
  }
}

export const discoverReaders = async () => {
  if (!terminal) {
    terminal = await initializeStripeTerminal()
  }
  
  if (!terminal) return []
  
  try {
    console.log('Getting location for real readers...')
    
    // Get or create a location first
    const locationResponse = await fetch('/api/terminal/location', {
      method: 'POST',
    })
    
    if (!locationResponse.ok) {
      console.error('Failed to get location')
      return []
    }
    
    const { locationId } = await locationResponse.json()
    console.log('Using location:', locationId)
    
    console.log('Checking Tap to Pay compatibility...')
    
    // Check iOS version for Tap to Pay compatibility
    const isIOS15_4Plus = /OS 1[5-9]_[4-9]|OS [2-9][0-9]/.test(navigator.userAgent)
    const isCompatibleDevice = /iPhone/.test(navigator.userAgent) // All iPhones for now
    const isSafari = /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent)
    
    console.log('Compatibility check:', {
      isIOS15_4Plus,
      isCompatibleDevice,
      isSafari,
      userAgent: navigator.userAgent
    })
    
    if (!isCompatibleDevice) {
      console.error('Device not compatible with Tap to Pay')
      return []
    }
    
    if (!isSafari) {
      console.warn('Tap to Pay works best in Safari browser')
    }
    
    console.log('Initializing Tap to Pay on iPhone...')
    // For Tap to Pay on iPhone - uses phone's built-in NFC
    const discoverResult = await terminal.discoverReaders({
      simulated: false, // Real mobile NFC
      discoveryMethod: 'tap_to_pay', // Mobile tap to pay (software-based)
      location: locationId, // Use the real location
    })
    
    if (discoverResult.error) {
      console.error('Failed to discover readers:', discoverResult.error)
      return []
    }
    
    console.log('Found real readers:', discoverResult.discoveredReaders?.length || 0)
    console.log('Reader discovery result:', discoverResult)
    
    if (discoverResult.discoveredReaders?.length === 0) {
      console.warn('No Tap to Pay readers found. This might be because:')
      console.warn('1. Stripe Tap to Pay requires live keys (not test keys)')
      console.warn('2. Your Stripe account needs approval for Tap to Pay')
      console.warn('3. Tap to Pay is only available in certain regions')
      console.warn('4. Device/browser compatibility issues')
      
      // For testing, let's create a mock reader
      console.log('Creating mock reader for testing...')
      return [{
        id: 'tmr_mock_tap_to_pay',
        object: 'terminal.reader',
        label: 'iPhone Tap to Pay (Test Mode)',
        device_type: 'tap_to_pay',
        location: locationId,
        status: 'online'
      }]
    }
    
    return discoverResult.discoveredReaders || []
  } catch (error) {
    console.error('Error discovering readers:', error)
    console.error('Full error details:', JSON.stringify(error, null, 2))
    return []
  }
}

export const connectReader = async (reader: any) => {
  if (!terminal) return null
  
  try {
    console.log('Connecting to reader:', reader?.label || 'Unknown')
    const connectResult = await terminal.connectReader(reader)
    
    if (connectResult.error) {
      console.error('Failed to connect reader:', connectResult.error)
      return null
    }
    
    console.log('Successfully connected to reader')
    return connectResult.reader
  } catch (error) {
    console.error('Error connecting reader:', error)
    return null
  }
}

export const collectPayment = async (paymentIntentClientSecret: string) => {
  if (!terminal) return null
  
  try {
    const collectResult = await terminal.collectPaymentMethod(paymentIntentClientSecret, {
      config_override: {
        enable_customer_cancellation: true,
      }
    })
    
    if (collectResult.error) {
      console.error('Failed to collect payment:', collectResult.error)
      return null
    }
    
    return collectResult.paymentIntent
  } catch (error) {
    console.error('Error collecting payment:', error)
    return null
  }
}

export const processPayment = async (paymentIntent: any) => {
  if (!terminal) return null
  
  try {
    const processResult = await terminal.processPayment(paymentIntent)
    
    if (processResult.error) {
      console.error('Failed to process payment:', processResult.error)
      return null
    }
    
    return processResult.paymentIntent
  } catch (error) {
    console.error('Error processing payment:', error)
    return null
  }
}