export default function Terms() {
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
          <h1 className="text-3xl font-bold mb-8">Terms of Service</h1>

          <div className="space-y-6 text-gray-700">
            <section>
              <h2 className="text-xl font-semibold mb-3 text-black">Acceptance of Terms</h2>
              <p>By using PhoneTap, you agree to these terms. If you do not agree, please do not use our service.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-black">Service Description</h2>
              <p>
                PhoneTap provides mobile payment processing services that allow you to accept credit card and digital
                wallet payments using your smartphone.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-black">Fees and Pricing</h2>
              <p>
                We charge 2.9% per successful transaction. There are no monthly fees, setup fees, or cancellation fees.
                Fees are automatically deducted from each transaction.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-black">Account Requirements</h2>
              <p>
                You must provide accurate business information, maintain a valid bank account, and comply with all
                applicable laws and regulations when using our service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-black">Prohibited Activities</h2>
              <p>
                You may not use our service for illegal activities, fraudulent transactions, or any business that
                violates our acceptable use policy.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-black">Limitation of Liability</h2>
              <p>
                Our liability is limited to the fees paid for our services. We are not responsible for indirect,
                incidental, or consequential damages.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-black">Termination</h2>
              <p>
                Either party may terminate this agreement at any time. Upon termination, you remain responsible for any
                outstanding fees or obligations.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-black">Contact Us</h2>
              <p>For questions about these terms, contact us at legal@phonetap.com</p>
            </section>

            <p className="text-sm text-gray-500 mt-8">Last updated: January 2025</p>
          </div>
        </div>
      </main>
    </div>
  )
}
