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
    if (!terminal && window.StripeTerminal) {
      terminal = window.StripeTerminal.create({
        onFetchConnectionToken: fetchConnectionToken,
        onUnexpectedReaderDisconnect: unexpectedDisconnect,
      })
    }
    
    return terminal
  } catch (error) {
    console.error('Failed to initialize Stripe Terminal:', error)
    return null
  }
}

export const discoverReaders = async () => {
  if (!terminal) {
    terminal = await initializeStripeTerminal()
  }
  
  if (!terminal) return []
  
  try {
    console.log('Discovering readers...')
    // For Tap to Pay on iPhone/Android, discover mobile readers
    const discoverResult = await terminal.discoverReaders({
      simulated: true, // Use false for production
    })
    
    if (discoverResult.error) {
      console.error('Failed to discover readers:', discoverResult.error)
      return []
    }
    
    console.log('Found readers:', discoverResult.discoveredReaders?.length || 0)
    return discoverResult.discoveredReaders || []
  } catch (error) {
    console.error('Error discovering readers:', error)
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