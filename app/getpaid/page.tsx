"use client"

import { useState, useEffect, Suspense } from "react"
import { signOut, useSession } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ExternalLink, Landmark, PiggyBank } from "lucide-react"
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
    setOnboardingStatus("Setting up your payment account...")
    
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
        throw new Error(data.error || 'Failed to create payment account')
      }
      
      if (data.onboardingUrl) {
        setOnboardingStatus("Redirecting...")
        window.location.href = data.onboardingUrl
      } else {
        throw new Error('No onboarding URL received')
      }
      
    } catch (error) {
      console.error("Payment setup failed:", error)
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
            <p className="text-gray-600">Your payment account has been successfully configured.</p>
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
          <div className="text-center space-y-6">
            <div className="space-y-2">
              <h2 className="text-xl font-medium">Download the App</h2>
              <p className="text-gray-600">
                Continue with the PhoneTap mobile app to start accepting payments
              </p>
            </div>
            
            <div className="space-y-3">
              
              <Button className="w-full rounded-full bg-black text-white flex items-center space-x-3 hover:bg-gray-800 transition-colors py-4">
                <svg className="w-18 h-18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                </svg>
                <div className="text-left">
                  <div className="text-xs">Download on the</div>
                  <div className="-mt-1 font-medium">App Store</div>
                </div>
              </Button>
              
             
            </div>
          </div>

        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white px-4 py-8">
      <div className="max-w-md mx-auto space-y-8">
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
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-normal">Welcome, {session.user?.name?.split(' ')[0]}</h1>
          <p className="text-gray-600 text-lg">Let's get you set up to accept payments</p>
        </div>

        {/* Status Alert */}
        {onboardingStatus && (
          <div className="text-center">
            <p className="text-gray-600">{onboardingStatus}</p>
          </div>
        )}

        {/* Simple Continue Button */}
        <div className="text-center space-y-6">
          <Button
            onClick={handleStripeConnect}
            disabled={isRedirecting}
            className="w-full flex items-center bg-white justify-center space-x-3 py-3 px-6 border border-gray-300 rounded-full hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            {isRedirecting ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-400"></div>
                <span className="text-gray-700 font-medium">Setting up...</span>
              </>
            ) : (
              <>
               <Landmark className="w-5 h-5 text-black" />
                <span className="text-gray-700 font-medium">Connect Bank Account</span>
              </>
            )}
          </Button>
          
          <p className="text-sm text-gray-500">
            Complete account verification to start accepting payments
          </p>
        </div>

        {/* HandyHurry branding */}
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2">
            <span className="text-sm text-gray-500">A product of</span>
            <Link href="https://handyhurry.com" className="hover:opacity-80 transition-opacity">
              <svg width="85" height="20" viewBox="0 0 129 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15.7518 19H11.8209V10.6327H4.54865V19H0.645796V0.356146H4.54865V7.37567H11.8209V0.356146H15.7518V19ZM24.9082 13.7494L24.9363 12.2332C24.5713 12.5982 23.9255 12.7947 22.5777 13.0474C20.4999 13.4405 19.8261 14.0302 19.8261 15.2095C19.8261 16.2483 20.4438 16.7538 21.595 16.7538C23.4762 16.7538 24.8801 15.3779 24.9082 13.7494ZM28.5864 19H25.189C25.0767 18.6631 24.9924 18.1857 24.9644 17.7646C24.0939 18.7192 22.6339 19.365 20.7807 19.365C17.636 19.365 16.1759 17.8207 16.1759 15.5745C16.1759 11.5874 18.8433 11.1381 22.5216 10.6327C24.3466 10.38 24.852 10.015 24.852 9.06036C24.852 8.16186 23.9535 7.62837 22.5216 7.62837C20.865 7.62837 20.1911 8.44264 20.0226 9.67807H16.6252C16.6813 6.81411 18.2537 4.82056 22.69 4.82056C27.0702 4.82056 28.5864 6.78603 28.5864 10.2677V19ZM42.0504 19H38.3722V10.6327C38.3722 8.49879 37.7545 7.90915 36.0136 7.90915C34.1043 7.90915 33.1777 8.97612 33.1777 11.082V19H29.5276V5.18558H33.0093V7.2072C33.8516 5.66291 35.2555 4.82056 37.4737 4.82056C40.113 4.82056 42.0504 6.42101 42.0504 9.42537V19ZM49.5225 16.3887C51.2634 16.3887 52.6111 14.7602 52.6111 12.4297C52.6111 9.42537 51.5722 7.93723 49.5506 7.93723C47.4167 7.93723 46.4059 9.36921 46.4059 12.2051C46.4059 14.676 47.6975 16.3887 49.5225 16.3887ZM56.0647 19H52.555L52.5269 17.3153C51.6565 18.7192 50.3649 19.365 48.6802 19.365C45.1985 19.365 42.6996 16.6134 42.6996 11.9524C42.6996 7.76876 44.8054 4.82056 48.3713 4.82056C50.0841 4.82056 51.4319 5.52252 52.4707 6.98258V0.13152H56.0647V19ZM65.7974 19.4212V17.1749C65.292 18.4104 63.7758 19.1404 62.063 19.1404C59.171 19.1404 57.009 17.1749 57.009 14.1425V5.18558H60.6591V13.609C60.6591 15.3218 61.4453 16.1922 62.9896 16.1922C64.6462 16.1922 65.7974 15.0971 65.7974 13.609V5.18558H69.4475V19.365C69.4475 23.2679 66.6397 25.5422 63.1019 25.5422C59.0587 25.5422 57.009 23.324 57.009 19.7581H60.4064C60.4064 21.3866 61.3611 22.3974 63.2704 22.3974C64.59 22.3974 65.7974 21.2462 65.7974 19.4212ZM85.4561 19H81.5252V10.6327H74.2529V19H70.3501V0.356146H74.2529V7.37567H81.5252V0.356146H85.4561V19ZM98.6838 19H95.2302V17.0626C94.2755 18.635 92.8436 19.365 90.9343 19.365C88.1826 19.365 86.2452 17.3153 86.2452 14.2829V5.18558H89.8954V13.7213C89.8954 15.4622 90.6816 16.3045 92.2258 16.3045C94.079 16.3045 95.0617 14.9848 95.0617 13.1598V5.18558H98.6838V19ZM103.266 19H99.6157V5.18558H103.041V6.84219C104.249 4.98903 105.653 4.82056 107.141 4.82056H107.618V8.55495C107.281 8.49879 106.944 8.47071 106.607 8.47071C104.361 8.47071 103.266 9.59384 103.266 11.812V19ZM111.619 19H107.968V5.18558H111.394V6.84219C112.601 4.98903 114.005 4.82056 115.493 4.82056H115.971V8.55495C115.634 8.49879 115.297 8.47071 114.96 8.47071C112.714 8.47071 111.619 9.59384 111.619 11.812V19ZM125.109 19.4212V17.1749C124.604 18.4104 123.088 19.1404 121.375 19.1404C118.483 19.1404 116.321 17.1749 116.321 14.1425V5.18558H119.971V13.609C119.971 15.3218 120.757 16.1922 122.302 16.1922C123.958 16.1922 125.109 15.0971 125.109 13.609V5.18558H128.76V19.365C128.76 23.2679 125.952 25.5422 122.414 25.5422C118.371 25.5422 116.321 23.324 116.321 19.7581H119.718C119.718 21.3866 120.673 22.3974 122.582 22.3974C123.902 22.3974 125.109 21.2462 125.109 19.4212Z" fill="#3AB75C"/>
              </svg>
            </Link>
          </div>
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