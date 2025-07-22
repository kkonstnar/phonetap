# PhoneTap - Mobile Payment Terminal

Turn your phone into a payment terminal. Accept credit cards, tap to pay, and digital wallets with no extra hardware needed.

## Features

- **Mobile-First Design**: Optimized for mobile devices with responsive UI
- **Authentication**: Sign in with Google and Apple
- **Stripe Terminal Integration**: Accept contactless payments via Stripe Tap to Pay
- **PWA Support**: Install as a progressive web app
- **Secure**: Built with security best practices

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Authentication**: NextAuth.js with Google & Apple providers
- **Payments**: Stripe Terminal JS SDK
- **UI**: Tailwind CSS, shadcn/ui components
- **PWA**: Service Worker, Web App Manifest

## Setup Instructions

### 1. Environment Variables

Copy the example environment file and fill in your credentials:

```bash
cp .env.example .env.local
```

Required environment variables:

```env
# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret-here

# Google OAuth (required)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Apple Sign In (optional)
APPLE_ID=your-apple-id
APPLE_TEAM_ID=your-apple-team-id
APPLE_PRIVATE_KEY=your-apple-private-key
APPLE_KEY_ID=your-apple-key-id

# Stripe (required)
STRIPE_PUBLISHABLE_KEY=your-stripe-publishable-key
STRIPE_SECRET_KEY=your-stripe-secret-key
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Setting Up Authentication

### Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`

### Apple Sign In Setup (Optional)

1. Go to [Apple Developer Console](https://developer.apple.com/)
2. Create an App ID with Sign In with Apple capability
3. Create a Services ID
4. Generate a private key for Sign In with Apple
5. Configure the service with your domain

## Setting Up Stripe Terminal

### Prerequisites

1. Create a [Stripe account](https://stripe.com/)
2. Get your API keys from the Stripe dashboard
3. Enable Stripe Terminal in your account

### Stripe Terminal Configuration

1. In your Stripe dashboard, go to Terminal settings
2. Create a location for your business
3. For testing, you can use simulated readers
4. For production, you'll need compatible hardware or use Tap to Pay on iPhone/Android

### Tap to Pay Requirements

- **iOS**: iPhone XS or newer with iOS 12.4+
- **Android**: NFC-enabled device with Android 7.0+
- **Stripe Terminal SDK**: Integrated in this app

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to [Vercel](https://vercel.com/)
3. Add your environment variables in Vercel dashboard
4. Deploy automatically

### Other Platforms

The app can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## Project Structure

```
phonetap/
├── app/
│   ├── api/auth/         # NextAuth API routes
│   ├── api/terminal/     # Stripe Terminal API routes
│   ├── getpaid/         # Payment acceptance page
│   ├── layout.tsx       # Root layout with PWA meta tags
│   └── page.tsx         # Landing page
├── components/
│   ├── auth-provider.tsx # NextAuth session provider
│   └── ui/              # shadcn/ui components
├── lib/
│   ├── auth.ts          # NextAuth configuration
│   └── stripe-terminal.ts # Stripe Terminal integration
├── public/
│   ├── manifest.json    # PWA manifest
│   └── sw.js           # Service worker
└── .env.example        # Environment variables template
```

## Usage

1. **Sign In**: Users authenticate with Google or Apple
2. **Enter Amount**: Merchant enters the payment amount in JMD
3. **Start Payment**: Tap "Start Tap to Pay" button
4. **Accept Payment**: Customer taps their card or device to the merchant's phone
5. **Confirmation**: Payment is processed and confirmed

## Security Considerations

- All API keys are stored as environment variables
- NextAuth provides secure session management
- Stripe handles all sensitive payment data
- HTTPS required for production (especially for Stripe Terminal)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Support

For support, please contact [your-email@example.com] or create an issue in this repository.

---

**Note**: This is a demo application. For production use, ensure you comply with all relevant payment processing regulations and security requirements in your jurisdiction.