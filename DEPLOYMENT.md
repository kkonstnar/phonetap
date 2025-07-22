# Deploy PhoneTap PWA for Mobile Testing

## 🚀 Quick Deployment Options

### Option 1: Vercel (Recommended - Free & Fast)

1. **Push to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial PhoneTap PWA"
   git branch -M main
   git remote add origin https://github.com/yourusername/phonetap.git
   git push -u origin main
   ```

2. **Deploy to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Sign up with GitHub
   - Click "New Project" 
   - Import your GitHub repo
   - Add environment variables:
     ```
     NEXTAUTH_URL=https://your-app.vercel.app
     NEXTAUTH_SECRET=your-secret
     GOOGLE_CLIENT_ID=your-google-id
     GOOGLE_CLIENT_SECRET=your-google-secret
     STRIPE_TEST_PUBLISHABLE_KEY=pk_test_...
     STRIPE_TEST_SECRET_KEY=sk_test_...
     ```
   - Deploy!

### Option 2: Netlify

1. **Build the app:**
   ```bash
   npm run build
   ```

2. **Deploy to Netlify:**
   - Go to [netlify.com](https://netlify.com)
   - Drag and drop your `.next` folder
   - Add environment variables in site settings

## 📱 Testing on Mobile

### iPhone Testing:
1. Open Safari on iPhone
2. Go to your deployed URL
3. Tap the **Share** button
4. Select **"Add to Home Screen"**
5. App installs as native PWA!

### Android Testing:
1. Open Chrome on Android
2. Go to your deployed URL
3. Tap menu (3 dots)
4. Select **"Add to Home Screen"**
5. App installs as PWA!

## 🔧 Update Google OAuth for Production

In Google Cloud Console:
1. Add your production URL to authorized redirect URIs:
   ```
   https://your-app.vercel.app/api/auth/callback/google
   ```

## 🎯 Tap to Pay Requirements

### iPhone:
- iPhone XS or newer
- iOS 15.4+
- NFC enabled
- Safari browser (for PWA)

### Android:
- NFC-enabled device
- Android 7.0+
- Chrome browser (for PWA)

## 🧪 Mobile Testing Flow

1. **Install PWA** on phone
2. **Open app** from home screen
3. **Sign in** with Google
4. **Enter amount** (e.g., $5.00)
5. **Tap "Start Tap to Pay"**
6. **Hold test card or phone** near device
7. **Payment processes!**

Ready to deploy? Let me know which option you prefer!