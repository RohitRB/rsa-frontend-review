# Vercel Deployment Guide for RSA Insurance Management System

## Prerequisites
1. **GitHub Account** - Your code should be in a GitHub repository
2. **Vercel Account** - Sign up at [vercel.com](https://vercel.com) (Free tier available)
3. **Firebase Project** - For database and authentication
4. **Razorpay Account** - For payment processing
5. **EmailJS Account** - For email notifications

## Step 1: Prepare Your GitHub Repository

1. **Push your code to GitHub:**
   ```bash
   git add .
   git commit -m "Prepare for Vercel deployment"
   git push origin main
   ```

2. **Ensure your repository is public or you have Vercel Pro for private repos**

## Step 2: Deploy to Vercel

### Option A: Deploy via Vercel Dashboard (Recommended)

1. **Go to [vercel.com](https://vercel.com) and sign in**
2. **Click "New Project"**
3. **Import your GitHub repository**
4. **Configure the project:**
   - **Framework Preset:** Vite
   - **Root Directory:** `./` (leave empty if project is in root)
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`

### Option B: Deploy via Vercel CLI

1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel:**
   ```bash
   vercel login
   ```

3. **Deploy:**
   ```bash
   vercel
   ```

## Step 3: Configure Environment Variables

In your Vercel project dashboard, go to **Settings > Environment Variables** and add:

### Required Environment Variables:

1. **VITE_APP_BACKEND_URL**
   - **Value:** Your backend API URL (if you have a separate backend)
   - **Example:** `https://your-backend-api.vercel.app` or `https://your-backend-api.herokuapp.com`

2. **VITE_APP_FIREBASE_CONFIG**
   - **Value:** Your Firebase configuration JSON (stringified)
   - **Example:** `{"apiKey":"your-api-key","authDomain":"your-project.firebaseapp.com","projectId":"your-project-id","storageBucket":"your-project.appspot.com","messagingSenderId":"123456789","appId":"your-app-id"}`

3. **VITE_APP_RAZORPAY_KEY_ID**
   - **Value:** Your Razorpay public key
   - **Example:** `rzp_live_your_key_here` or `rzp_test_your_key_here`

4. **VITE_APP_EMAILJS_USER_ID**
   - **Value:** Your EmailJS user ID
   - **Example:** `user_abc123def456`

5. **VITE_APP_INITIAL_AUTH_TOKEN** (Optional)
   - **Value:** Initial authentication token if needed

### Environment Variable Setup Steps:

1. **Go to your Vercel project dashboard**
2. **Navigate to Settings > Environment Variables**
3. **Add each variable with the appropriate values**
4. **Select all environments (Production, Preview, Development)**
5. **Click "Save"**

## Step 4: Backend Deployment (If Separate)

If you have a separate Node.js backend:

### Option A: Deploy Backend to Vercel

1. **Create a new Vercel project for your backend**
2. **Use the same GitHub repository but specify the backend directory**
3. **Configure as a Node.js API project**

### Option B: Deploy Backend to Other Platforms

- **Railway:** [railway.app](https://railway.app) (Free tier available)
- **Render:** [render.com](https://render.com) (Free tier available)
- **Heroku:** [heroku.com](https://heroku.com) (Paid plans)

## Step 5: Update Frontend Configuration

After deploying your backend, update the `VITE_APP_BACKEND_URL` environment variable in Vercel with your backend URL.

## Step 6: Test Your Deployment

1. **Visit your Vercel deployment URL**
2. **Test all major features:**
   - User registration/login
   - Policy selection
   - Payment processing
   - Admin dashboard
   - Email notifications

## Step 7: Custom Domain (Optional)

1. **Go to your Vercel project dashboard**
2. **Navigate to Settings > Domains**
3. **Add your custom domain**
4. **Configure DNS settings as instructed**

## Troubleshooting

### Common Issues:

1. **Build Failures:**
   - Check that all dependencies are in `package.json`
   - Ensure all environment variables are set
   - Check the build logs in Vercel dashboard

2. **API Connection Issues:**
   - Verify `VITE_APP_BACKEND_URL` is correct
   - Check CORS settings on your backend
   - Ensure backend is deployed and accessible

3. **Firebase Issues:**
   - Verify Firebase configuration is correct
   - Check Firebase project settings
   - Ensure Firebase rules allow your domain

4. **Payment Issues:**
   - Verify Razorpay keys are correct
   - Check if using test/live keys appropriately
   - Ensure webhook URLs are configured

### Getting Help:

- **Vercel Documentation:** [vercel.com/docs](https://vercel.com/docs)
- **Vercel Support:** Available in dashboard
- **Community:** [github.com/vercel/vercel/discussions](https://github.com/vercel/vercel/discussions)

## Cost Information

- **Vercel Free Tier:**
  - 100GB bandwidth per month
  - 100GB storage
  - 100GB function execution time
  - Perfect for small to medium projects

- **Upgrade to Pro ($20/month) for:**
  - Unlimited bandwidth
  - Team collaboration
  - Custom domains
  - Advanced analytics

## Security Notes

1. **Never commit environment variables to Git**
2. **Use environment variables for all sensitive data**
3. **Regularly rotate API keys**
4. **Monitor your application logs**
5. **Keep dependencies updated**

## Next Steps

After successful deployment:

1. **Set up monitoring and analytics**
2. **Configure error tracking (Sentry, etc.)**
3. **Set up automated testing**
4. **Plan for scaling as your user base grows** 