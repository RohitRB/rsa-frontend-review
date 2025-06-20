# Vercel Deployment Summary for RSA Insurance System

## What We've Set Up

### 1. Vercel Configuration
- Updated vercel.json with proper build settings
- Configured for Vite framework
- Set up SPA routing with rewrites

### 2. Serverless API Functions
- /api/create-order.js - Creates Razorpay orders
- /api/verify-payment.js - Verifies payment signatures
- /api/payments/verify-and-save.js - Saves data to Firebase

### 3. Frontend Updates
- Updated Payment component to use Vercel API endpoints
- Updated PolicyContext to use relative API paths
- Added Razorpay dependency to package.json

### 4. Deployment Scripts
- deploy.sh - Bash script for Mac/Linux
- deploy.ps1 - PowerShell script for Windows
- DEPLOYMENT_GUIDE.md - Comprehensive deployment guide

## Ready for Deployment

Your project is now fully configured for Vercel deployment!

## Step-by-Step Deployment

### Step 1: Push to GitHub
```bash
git add .
git commit -m "Configure for Vercel deployment"
git push origin main
```

### Step 2: Deploy to Vercel

#### Option A: Vercel Dashboard (Easiest)
1. Go to vercel.com
2. Sign up/Login with GitHub
3. Click "New Project"
4. Import your repository
5. Configure:
   - Framework: Vite
   - Build Command: npm run build
   - Output Directory: dist
6. Click "Deploy"

#### Option B: Vercel CLI
```bash
npm install -g vercel
vercel login
vercel --prod
```

### Step 3: Configure Environment Variables

In your Vercel dashboard, go to Settings > Environment Variables and add:

- VITE_APP_FIREBASE_CONFIG
- VITE_APP_RAZORPAY_KEY_ID
- VITE_APP_EMAILJS_USER_ID
- RAZORPAY_KEY_SECRET

### Step 4: Test Your Application

1. Visit your Vercel deployment URL
2. Test user registration
3. Test policy selection
4. Test payment flow
5. Test admin dashboard

## API Endpoints Available

After deployment, these endpoints will be available:

- POST /api/create-order - Create Razorpay order
- POST /api/verify-payment - Verify payment signature
- POST /api/payments/verify-and-save - Save policy/customer data

## Free Tier Benefits

- 100GB bandwidth/month
- 100GB storage
- 100GB function execution time
- Automatic HTTPS
- Global CDN

## Success Checklist

- [ ] Code pushed to GitHub
- [ ] Deployed to Vercel
- [ ] Environment variables configured
- [ ] Payment system tested
- [ ] Admin dashboard working
- [ ] Email notifications working

Your RSA Insurance Management System is now ready for production! 