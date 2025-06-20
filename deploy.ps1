# RSA Insurance Management System - Vercel Deployment Script (PowerShell)

Write-Host "🚀 Starting Vercel deployment for RSA Insurance Management System..." -ForegroundColor Green

# Check if Vercel CLI is installed
try {
    $vercelVersion = vercel --version
    Write-Host "✅ Vercel CLI is installed: $vercelVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Vercel CLI is not installed. Installing now..." -ForegroundColor Yellow
    npm install -g vercel
}

# Check if user is logged in to Vercel
try {
    $whoami = vercel whoami
    Write-Host "✅ Logged in as: $whoami" -ForegroundColor Green
} catch {
    Write-Host "🔐 Please log in to Vercel..." -ForegroundColor Yellow
    vercel login
}

# Build the project
Write-Host "📦 Building the project..." -ForegroundColor Blue
npm run build

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Build completed successfully!" -ForegroundColor Green
} else {
    Write-Host "❌ Build failed!" -ForegroundColor Red
    exit 1
}

# Deploy to Vercel
Write-Host "🚀 Deploying to Vercel..." -ForegroundColor Blue
vercel --prod

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Deployment completed!" -ForegroundColor Green
} else {
    Write-Host "❌ Deployment failed!" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "📋 Next steps:" -ForegroundColor Cyan
Write-Host "1. Go to your Vercel dashboard" -ForegroundColor White
Write-Host "2. Add environment variables:" -ForegroundColor White
Write-Host "   - VITE_APP_FIREBASE_CONFIG" -ForegroundColor Yellow
Write-Host "   - VITE_APP_RAZORPAY_KEY_ID" -ForegroundColor Yellow
Write-Host "   - VITE_APP_EMAILJS_USER_ID" -ForegroundColor Yellow
Write-Host "   - RAZORPAY_KEY_SECRET" -ForegroundColor Yellow
Write-Host "3. Test your application" -ForegroundColor White
Write-Host ""
Write-Host "🔗 Your app will be available at the URL provided above" -ForegroundColor Green 