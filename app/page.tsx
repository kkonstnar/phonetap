import Image from "next/image"
import Link from "next/link"

export default function Page() {
  return (
    <div className="min-h-screen bg-white">
      {/* Main Content */}
      <main className="px-6 py-20">
        <div className="max-w-4xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="space-y-6">
                <h1 className="tracking-tight font-normal text-6xl">Turn your phone into a payment terminal</h1>
                <p className="text-gray-600 font-normal text-lg">
                  Accept credit cards, tap to pay, and digital wallets. No extra hardware needed.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <span className="text-xl">🇯🇲</span>
                  <span className="text-gray-700 font-normal">Works in Jamaica</span>
                </div>

                <Link href="/signup" className="inline-block">
                  <div className="bg-black text-white rounded-lg flex items-center space-x-3 hover:bg-gray-800 transition-colors w-fit py-1.5 px-5">
                    <svg className="w-8 h-7" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                    </svg>
                    <div className="text-left">
                      <div className="text-xs">Get started with</div>
                      <div className="-mt-1 font-medium text-md">PhoneTap</div>
                    </div>
                  </div>
                </Link>
              </div>
            </div>

            <div className="flex justify-center items-center">
              <Image
                src="/images/taptopay.png"
                width="600"
                height="400"
                alt="Contactless payment with phone showing $17.25 transaction"
                className="rounded-3xl"
              />
            </div>
          </div>
        </div>
      </main>

      {/* Features */}
      <section className="px-6 py-20 bg-slate-50">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-3 gap-12 text-center">
            <div>
              <svg className="w-8 h-8 mx-auto mb-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.7}
                  d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                />
              </svg>
              <h3 className="text-lg text-black font-semibold mb-2">No Hardware</h3>
              <p className="text-gray-600">Just your phone</p>
            </div>
            <div>
              <svg className="w-8 h-8 mx-auto mb-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.7}
                  d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                />
              </svg>
              <h3 className="text-lg text-black font-semibold mb-2">Accept Cards</h3>
              <div className="flex items-center justify-center space-x-2">
                <span className="text-lg">🇯🇲</span>
                <p className="text-gray-600">Visa, Mastercard</p>
              </div>
            </div>
            <div>
              <svg className="w-8 h-8 mx-auto mb-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.7}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h3 className="text-lg text-black font-semibold mb-2">Instant Setup</h3>
              <p className="text-gray-600">Start accepting in minutes</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-20">
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <h2 className="text-3xl font-medium">Start accepting payments today</h2>
          <Link href="/signup" className="inline-block">
            <div className="bg-black text-white rounded-lg flex items-center space-x-3 hover:bg-gray-800 transition-colors w-fit mx-auto px-5 py-1.5">
              <svg className="w-8 h-7" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
              </svg>
              <div className="text-left">
                <div className="text-xs">Get started with</div>
                <div className="text-md -mt-1 font-medium">PhoneTap</div>
              </div>
            </div>
          </Link>
          <p className="text-sm text-gray-500">Free • No monthly fees • 4.9% per transaction</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-8 border-t">
        <div className="max-w-4xl mx-auto flex justify-between items-center text-sm text-gray-500">
          <span>© 2025 PhoneTap</span>
          <div className="space-x-6">
            <Link href="/privacy" className="hover:text-black">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-black">
              Terms
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}