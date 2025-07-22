import type { Metadata } from 'next'
import './globals.css'
import { AuthProvider } from '@/components/auth-provider'

export const metadata: Metadata = {
  title: 'PhoneTap - Turn your phone into a payment terminal',
  description: 'Accept credit cards, tap to pay, and digital wallets. No extra hardware needed.',
  generator: 'v0.dev',
  manifest: '/manifest.json',
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: '#000000',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="PhoneTap" />
        <link rel="apple-touch-icon" href="/icon-192x192.png" />
        <script src="https://js.stripe.com/terminal/v1/"></script>
        <script src="https://cdn.jsdelivr.net/npm/eruda"></script>
        <script>eruda.init();</script>
      </head>
      <body className="bg-white">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  )
}
