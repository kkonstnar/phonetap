"use client"

import { useState, useEffect } from "react"
import { signOut, useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CreditCard, Wallet } from "lucide-react"
import { initializeStripeTerminal, discoverReaders, connectReader, collectPayment, processPayment } from "@/lib/stripe-terminal"
import Link from "next/link"

export default function GetPaidPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [amount, setAmount] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [terminal, setTerminal] = useState(null)
  const [readers, setReaders] = useState([])
  const [connectedReader, setConnectedReader] = useState(null)
  const [paymentStatus, setPaymentStatus] = useState("")

  useEffect(() => {
    if (status === "loading") return // Still loading
    
    if (!session) {
      router.push("/signup")
      return
    }

    const setupTerminal = async () => {
      const terminalInstance = await initializeStripeTerminal()
      setTerminal(terminalInstance)
      
      if (terminalInstance) {
        const discoveredReaders = await discoverReaders()
        setReaders(discoveredReaders)
        
        // Auto-connect to first available reader (simulated for testing)
        if (discoveredReaders.length > 0) {
          const reader = await connectReader(discoveredReaders[0])
          setConnectedReader(reader)
        }
      }
    }
    
    setupTerminal()
  }, [session, status, router])

  const handleTapToPay = async () => {
    if (!amount || !session) return
    
    if (!connectedReader) {
      setPaymentStatus("No reader connected. Please wait...")
      return
    }
    
    setIsProcessing(true)
    setPaymentStatus("Creating payment intent...")
    
    try {
      // Create payment intent
      const response = await fetch('/api/terminal/payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: parseFloat(amount),
          currency: 'usd'
        }),
      })
      
      const { clientSecret } = await response.json()
      
      if (!clientSecret) {
        throw new Error('Failed to create payment intent')
      }
      
      setPaymentStatus("Hold card or device near your phone's NFC area...")
      
      // Collect payment method
      const paymentIntent = await collectPayment(clientSecret)
      
      if (!paymentIntent) {
        throw new Error('Failed to collect payment method')
      }
      
      setPaymentStatus("Processing payment...")
      
      // Process payment
      const processedPayment = await processPayment(paymentIntent)
      
      if (processedPayment && processedPayment.status === 'succeeded') {
        setPaymentStatus("Payment successful! 🎉")
        setAmount("")
        setTimeout(() => setPaymentStatus(""), 3000)
      } else {
        throw new Error('Payment failed')
      }
      
    } catch (error) {
      console.error("Payment failed:", error)
      let message = "Payment failed"
      if (error instanceof Error) {
        message = `Payment failed: ${error.message}`
      } else if (typeof error === "string") {
        message = `Payment failed: ${error}`
      }
      setPaymentStatus(message)
      setTimeout(() => setPaymentStatus(""), 5000)
    } finally {
      setIsProcessing(false)
    }
  }

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!session) {
    return null // Will redirect to signup
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="max-w-md mx-auto space-y-6">
        {/* Header with Back Button */}
        <div className="flex items-center justify-between">
          <Link href="/" className="inline-flex items-center text-gray-600 hover:text-black">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </Link>
          <button 
            onClick={() => signOut()}
            className="text-gray-600 hover:text-black text-sm"
          >
            Sign Out
          </button>
        </div>

        {/* Welcome Section */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-medium">Welcome, {session.user?.name?.split(' ')[0]}</h1>
          <p className="text-gray-600">Ready to accept payments</p>
        </div>

        {/* User Profile Card */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-3">
              {session.user?.image && (
                <img 
                  src={session.user.image} 
                  alt="Profile" 
                  className="w-12 h-12 rounded-full"
                />
              )}
              <div>
                <p className="font-medium">{session.user?.name}</p>
                <p className="text-sm text-gray-600">{session.user?.email}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Connection Status */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${connectedReader ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
              <span className="text-sm">
                {connectedReader ? 'Reader Connected' : 'Connecting to reader...'}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Payment Status */}
        {paymentStatus && (
          <Alert>
            <AlertDescription>{paymentStatus}</AlertDescription>
          </Alert>
        )}

        {/* Payment Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Accept Payment</CardTitle>
            <CardDescription>Enter the amount to charge</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount (USD)</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                <Input
                  id="amount"
                  type="number"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="pl-8 h-12 text-lg"
                />
              </div>
            </div>

            <Button 
              onClick={handleTapToPay}
              disabled={!amount || isProcessing}
              className="w-full h-12 text-lg bg-blue-600 hover:bg-blue-700"
            >
              {isProcessing ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Processing...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <span className="text-white font-medium">Start Tap to Pay</span>
                </div>
              )}
            </Button>

            <div className="text-center">
              <p className="text-xs text-gray-500">
                Hold customer's card or device near your phone's NFC area (usually near the top)
              </p>
              <p className="text-xs text-green-600 mt-1">
                ⚡ Real NFC payments enabled
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Features */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-4 bg-white rounded-lg">
            <div className="text-2xl mb-2 flex justify-center items-center"><CreditCard /></div>
            <h3 className="font-medium text-sm">Cards</h3>
            <p className="text-xs text-gray-500">Visa, Mastercard</p>
          </div>
          <div className="text-center p-4 bg-white rounded-lg">
            <div className="text-2xl mb-2 flex justify-center items-center"><Wallet /></div>
            <h3 className="font-medium text-sm">Digital Wallets</h3>
            <p className="text-xs text-gray-500">Apple Pay, Google Pay</p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-xs text-gray-500 space-y-1">
          <p>Powered by Stripe Terminal</p>
          <p>2.9% + $0.30 per transaction</p>
          <p className="text-green-600">🚀 Live NFC Hardware Mode</p>
        </div>
      </div>
    </div>
  )
}