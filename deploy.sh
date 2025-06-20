#!/bin/bash

# RSA Insurance Management System - Vercel Deployment Script

echo "🚀 Starting Vercel deployment for RSA Insurance Management System..."

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI is not installed. Installing now..."
    npm install -g vercel
fi

# Check if user is logged in to Vercel
if ! vercel whoami &> /dev/null; then
    echo "🔐 Please log in to Vercel..."
    vercel login
fi

# Build the project
echo "📦 Building the project..."
npm run build

# Deploy to Vercel
echo "🚀 Deploying to Vercel..."
vercel --prod

echo "✅ Deployment completed!"
echo ""
echo "📋 Next steps:"
echo "1. Go to your Vercel dashboard"
echo "2. Add environment variables:"
echo "   - VITE_APP_FIREBASE_CONFIG"
echo "   - VITE_APP_RAZORPAY_KEY_ID"
echo "   - VITE_APP_EMAILJS_USER_ID"
echo "   - RAZORPAY_KEY_SECRET"
echo "3. Test your application"
echo ""
echo "🔗 Your app will be available at the URL provided above" 