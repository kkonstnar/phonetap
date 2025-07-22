export default function Privacy() {
  return (
    <div className="min-h-screen bg-white">
      <main className="px-6 py-12">
        <div className="max-w-3xl mx-auto">
          <a href="/" className="inline-flex items-center text-gray-600 hover:text-black mb-8">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </a>
          <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>

          <div className="space-y-6 text-gray-700">
            <section>
              <h2 className="text-xl font-semibold mb-3 text-black">Information We Collect</h2>
              <p>
                We collect information you provide when creating an account, processing payments, and using our
                services. This includes your name, email, business information, and transaction data.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-black">How We Use Your Information</h2>
              <p>
                We use your information to provide payment processing services, prevent fraud, comply with legal
                requirements, and improve our app. We do not sell your personal information to third parties.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-black">Data Security</h2>
              <p>
                We use industry-standard encryption and security measures to protect your data. Payment information is
                processed securely and we are PCI DSS compliant.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-black">Data Sharing</h2>
              <p>
                We share data only as necessary to process payments, comply with legal requirements, or with your
                explicit consent. We work with trusted payment processors and financial institutions.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-black">Your Rights</h2>
              <p>
                You can access, update, or delete your account information at any time through the app. You may also
                contact us to request data deletion or portability.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-black">Contact Us</h2>
              <p>If you have questions about this privacy policy, contact us at privacy@phonetap.com</p>
            </section>

            <p className="text-sm text-gray-500 mt-8">Last updated: January 2025</p>
            <p>By using PhoneTap, you agree to these terms. If you do not agree, please do not use our service.</p>
          </div>
        </div>
      </main>
    </div>
  )
}
