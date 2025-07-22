"use client"

import { useState, useEffect, Suspense } from "react"
import { signOut, useSession } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ExternalLink, CreditCard, Download } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

function GetPaidContent() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isRedirecting, setIsRedirecting] = useState(false)
  const [onboardingStatus, setOnboardingStatus] = useState("")
  
  const isOnboardingComplete = searchParams.get('success') === 'true'

  useEffect(() => {
    if (status === "loading") return
    
    if (!session) {
      router.push("/signup")
      return
    }
  }, [session, status, router])

  const handleStripeConnect = async () => {
    if (!session) return
    
    setIsRedirecting(true)
    setOnboardingStatus("Setting up your Stripe Connect account...")
    
    try {
      const response = await fetch('/api/stripe/connect', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: session.user?.email,
          name: session.user?.name
        }),
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to create Stripe Connect account')
      }
      
      if (data.onboardingUrl) {
        setOnboardingStatus("Redirecting to Stripe...")
        window.location.href = data.onboardingUrl
      } else {
        throw new Error('No onboarding URL received')
      }
      
    } catch (error) {
      console.error("Stripe Connect setup failed:", error)
      let message = "Setup failed"
      if (error instanceof Error) {
        message = `Setup failed: ${error.message}`
      } else if (typeof error === "string") {
        message = `Setup failed: ${error}`
      }
      setOnboardingStatus(message)
      setTimeout(() => setOnboardingStatus(""), 5000)
    } finally {
      setIsRedirecting(false)
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
    return null
  }

  // Show download app screen after successful onboarding
  if (isOnboardingComplete) {
    return (
      <div className="min-h-screen bg-white px-4 py-8">
        <div className="max-w-md mx-auto space-y-8">
          {/* Header */}
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

          {/* Success Message */}
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-2xl font-medium">Setup Complete!</h1>
            <p className="text-gray-600">Your Stripe account has been successfully configured.</p>
          </div>

          {/* Image */}
          <div className="flex justify-center">
            <Image
              src="/images/taptopay.png"
              width="300"
              height="200"
              alt="PhoneTap payment interface"
              className="rounded-2xl"
            />
          </div>

          {/* Download App Message */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center justify-center">
                <Download className="w-5 h-5 mr-2" />
                Download the App
              </CardTitle>
              <CardDescription className="text-center">
                Continue with the PhoneTap mobile app to start accepting payments
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center space-y-3">
                <p className="text-sm text-gray-600">
                  The full payment terminal experience is available in our mobile app
                </p>
                
                <div className="space-y-2">
                  <Button className="w-full bg-black text-white rounded-lg flex items-center space-x-3 hover:bg-gray-800 transition-colors py-3">
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                    </svg>
                    <div className="text-left">
                      <div className="text-xs">Download on the</div>
                      <div className="-mt-1 font-medium">App Store</div>
                    </div>
                  </Button>
                  
                  <Button className="w-full bg-black text-white rounded-lg flex items-center space-x-3 hover:bg-gray-800 transition-colors py-3">
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 0 1-.61-.92V2.734a1 1 0 0 1 .609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.198l2.807 1.626a1 1 0 0 1 0 1.73l-2.808 1.626L15.696 12l2.002-2.491zM5.864 2.658L16.802 8.99l-2.303 2.303L5.864 2.658z"/>
                    </svg>
                    <div className="text-left">
                      <div className="text-xs">Get it on</div>
                      <div className="-mt-1 font-medium">Google Play</div>
                    </div>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Footer */}
          <div className="text-center text-xs text-gray-500 space-y-1">
            <p>Your account is ready to accept payments</p>
            <p className="text-green-600">✓ Stripe Connect configured</p>
          </div>
        </div>
      </div>
    )
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
          <p className="text-gray-600">Let's set up your payment processing</p>
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

        {/* Onboarding Status */}
        {onboardingStatus && (
          <Alert>
            <AlertDescription>{onboardingStatus}</AlertDescription>
          </Alert>
        )}

        {/* Stripe Connect Setup Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <CreditCard className="w-5 h-5 mr-2" />
              Set Up Payment Processing
            </CardTitle>
            <CardDescription>
              Connect with Stripe to start accepting payments online
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-medium">1</div>
                <div>
                  <p className="font-medium">Verify your business</p>
                  <p className="text-sm text-gray-600">Provide business details and tax information</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-medium">2</div>
                <div>
                  <p className="font-medium">Add bank account</p>
                  <p className="text-sm text-gray-600">Connect your bank account for payouts</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-medium">3</div>
                <div>
                  <p className="font-medium">Start accepting payments</p>
                  <p className="text-sm text-gray-600">Begin processing customer payments</p>
                </div>
              </div>
            </div>

            <Button 
              onClick={handleStripeConnect}
              disabled={isRedirecting}
              className="w-full h-12 text-lg bg-blue-600 hover:bg-blue-700"
            >
              {isRedirecting ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Setting up...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <span>Continue with Stripe</span>
                  <ExternalLink className="w-4 h-4" />
                </div>
              )}
            </Button>

            <div className="text-center">
              <p className="text-xs text-gray-500">
                You'll be redirected to Stripe to complete setup
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Features */}
        <div className="grid grid-cols-1 gap-4">
          <div className="text-center p-4 bg-white rounded-lg">
            <div className="text-2xl mb-2 flex justify-center items-center">💳</div>
            <h3 className="font-medium text-sm">Accept All Payment Methods</h3>
            <p className="text-xs text-gray-500">Credit cards, digital wallets, bank transfers</p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-xs text-gray-500 space-y-1">
          <p>Powered by Stripe Connect</p>
          <p>Secure, reliable payment processing</p>
        </div>
      </div>
    </div>
  )
}

export default function GetPaidPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    }>
      <GetPaidContent />
    </Suspense>
  )
}