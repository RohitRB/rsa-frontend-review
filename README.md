# RSA Insurance Management System

A comprehensive insurance management system built with React, TypeScript, and Firebase, featuring Razorpay payment integration.

## 🚀 Quick Deploy to Vercel

### Option 1: Deploy via Vercel Dashboard (Recommended)

1. **Fork/Clone this repository to your GitHub account**
2. **Go to [vercel.com](https://vercel.com) and sign up/login**
3. **Click "New Project"**
4. **Import your GitHub repository**
5. **Configure the project:**
   - **Framework Preset:** Vite
   - **Root Directory:** `./` (leave empty)
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`
6. **Click "Deploy"**

### Option 2: Deploy via CLI

#### For Windows Users:
```powershell
# Run the PowerShell deployment script
.\deploy.ps1
```

#### For Mac/Linux Users:
```bash
# Run the bash deployment script
chmod +x deploy.sh
./deploy.sh
```

#### Manual CLI Deployment:
```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod
```

## ⚙️ Environment Variables Setup

After deployment, configure these environment variables in your Vercel dashboard:

### Required Variables:

1. **VITE_APP_FIREBASE_CONFIG**
   ```
   {"apiKey":"your-api-key","authDomain":"your-project.firebaseapp.com","projectId":"your-project-id","storageBucket":"your-project.appspot.com","messagingSenderId":"123456789","appId":"your-app-id"}
   ```

2. **VITE_APP_RAZORPAY_KEY_ID**
   ```
   rzp_test_your_key_here
   ```

3. **VITE_APP_EMAILJS_USER_ID**
   ```
   user_abc123def456
   ```

4. **RAZORPAY_KEY_SECRET**
   ```
   your_razorpay_secret_key
   ```

### How to Add Environment Variables:

1. Go to your Vercel project dashboard
2. Navigate to **Settings > Environment Variables**
3. Add each variable with the appropriate values
4. Select all environments (Production, Preview, Development)
5. Click "Save"

## 🛠️ Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📁 Project Structure

```
rsa-frontend-review/
├── api/                    # Vercel serverless functions
│   ├── create-order.js
│   ├── verify-payment.js
│   └── payments/
│       └── verify-and-save.js
├── src/
│   ├── components/         # React components
│   ├── context/           # React context providers
│   ├── pages/             # Page components
│   │   ├── admin/         # Admin pages
│   │   └── user/          # User pages
│   └── main.jsx           # App entry point
├── vercel.json            # Vercel configuration
├── package.json           # Dependencies and scripts
└── README.md              # This file
```

## 🔧 Features

- **User Management:** Customer registration and profile management
- **Policy Management:** Create, view, and manage insurance policies
- **Payment Integration:** Secure payments via Razorpay
- **Admin Dashboard:** Analytics and policy management
- **Real-time Data:** Firebase Firestore integration
- **Responsive Design:** Mobile-friendly UI with Tailwind CSS
- **Email Notifications:** Automated email sending via EmailJS

## 🚀 Deployment Features

- **Serverless API:** Vercel functions for backend operations
- **Payment Verification:** Secure Razorpay payment verification
- **Firebase Integration:** Real-time database and authentication
- **Environment Management:** Secure configuration via environment variables
- **Automatic Deployments:** Git-based deployment workflow

## 📊 Free Tier Limits

- **Vercel Free Tier:**
  - 100GB bandwidth per month
  - 100GB storage
  - 100GB function execution time
  - Perfect for small to medium projects

## 🔒 Security

- Environment variables for sensitive data
- Payment signature verification
- Firebase security rules
- CORS protection

## 🆘 Troubleshooting

### Common Issues:

1. **Build Failures:**
   - Check all dependencies are installed
   - Verify environment variables are set
   - Check build logs in Vercel dashboard

2. **Payment Issues:**
   - Verify Razorpay keys are correct
   - Check webhook configurations
   - Ensure proper signature verification

3. **Firebase Issues:**
   - Verify Firebase configuration
   - Check Firebase project settings
   - Ensure proper security rules

### Getting Help:

- **Vercel Documentation:** [vercel.com/docs](https://vercel.com/docs)
- **Vercel Support:** Available in dashboard
- **Community:** [github.com/vercel/vercel/discussions](https://github.com/vercel/vercel/discussions)

## 📝 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---

**Happy Deploying! 🚀**