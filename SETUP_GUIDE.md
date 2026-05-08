# 🚀 PICCO Setup Guide

## Quick Start

### 1. Clone Repository
```bash
git clone https://github.com/jonathan-12341/PICCO-.git
cd PICCO-
```

### 2. Environment Variables Setup

#### Backend
```bash
cd backend
cp .env.example .env.local
```

Edit `.env.local` and fill in:
- Firebase credentials
- Google OAuth credentials
- M-Pesa Daraja API keys
- Claude/GPT-4 API keys
- SendGrid email key

#### Frontend
```bash
cd ../frontend
cp .env.example .env.local
```

Edit `.env.local` with:
- Firebase config
- Google OAuth Client ID
- Backend API URL

### 3. Install Dependencies

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 4. Start Development Servers

```bash
# Terminal 1: Backend (port 5000)
cd backend
npm run dev

# Terminal 2: Frontend (port 3000)
cd frontend
npm run dev
```

### 5. Access Application
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- Health Check: http://localhost:5000/api/health

---

## 🔐 M-Pesa Integration

### Get Your Credentials
1. Go to https://developer.safaricom.co.ke
2. Register and create a new app
3. You'll receive:
   - Consumer Key
   - Consumer Secret
   - Business Short Code
   - Passkey (for STK Push)

### Configuration

Add to `.env.local`:
```
MPESA_CONSUMER_KEY=your_consumer_key
MPESA_CONSUMER_SECRET=your_consumer_secret
MPESA_SHORTCODE=174379
MPESA_PASSKEY=your_passkey
MPESA_PHONE=254723525608
MPESA_ENV=sandbox  # Use 'production' later
```

### Testing Sandbox

```bash
# Test with sandbox credentials
curl -X POST http://localhost:5000/api/payments/initiate-stk \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "phoneNumber": "254723525608",
    "amount": 100,
    "tier": "pro",
    "orderId": "TEST-001"
  }'
```

---

## 🔥 Firebase Setup

### Create Firebase Project
1. Go to https://console.firebase.google.com
2. Create new project
3. Enable:
   - Authentication (Google OAuth, Email/Password)
   - Firestore Database
   - Cloud Storage
   - Cloud Functions

### Get Configuration
- In Project Settings → Service Accounts
- Copy the config object to `.env.local`

---

## 🤖 AI API Setup

### Claude (Anthropic)
1. Visit https://console.anthropic.com
2. Create API key
3. Add to `.env.local`: `CLAUDE_API_KEY=sk-ant-...`

### GPT-4 (OpenAI)
1. Visit https://platform.openai.com/api/keys
2. Create API key
3. Add to `.env.local`: `OPENAI_API_KEY=sk-...`

---

## 📧 Email Setup

### SendGrid
1. Create account at https://sendgrid.com
2. Generate API key
3. Add to `.env.local`: `SENDGRID_API_KEY=SG.xxx`

### Gmail + Nodemailer
1. Enable 2FA on Gmail
2. Generate App Password: https://myaccount.google.com/apppasswords
3. Add to `.env.local`:
   ```
   NODEMAILER_USER=your_email@gmail.com
   NODEMAILER_PASS=your_16_char_app_password
   ```

---

## 🌐 Google OAuth Setup

1. Go to https://console.cloud.google.com
2. Create new project
3. Enable Google+ API
4. Create OAuth 2.0 credentials (Web application)
5. Add authorized redirect URIs:
   - http://localhost:3000/auth/callback (development)
   - https://picco.com/auth/callback (production)
6. Copy Client ID and Secret to `.env.local`

---

## 📊 Google Sheets API (Admin Dashboard)

1. Create Service Account in Google Cloud Console
2. Download JSON key file
3. Create Google Sheet for transactions
4. Share sheet with service account email
5. Add to `.env.local`:
   ```
   GOOGLE_SHEETS_API_KEY=your_service_account_key
   GOOGLE_SHEETS_ID=your_spreadsheet_id
   ```

---

## 🚀 Deployment

### Frontend (Netlify)
```bash
# Build
npm run build

# Deploy to Netlify
netlify deploy --prod
```

### Backend (Heroku / Railway / Render)
```bash
# Create Procfile
echo "web: npm start" > Procfile

# Deploy
git push heroku main
```

---

## ✅ Checklist Before Launch

- [ ] Firebase project created and configured
- [ ] Google OAuth credentials obtained
- [ ] M-Pesa Daraja API keys acquired
- [ ] Claude/GPT-4 API keys added
- [ ] Email service configured (SendGrid or Gmail)
- [ ] Google Sheets API setup for admin dashboard
- [ ] Environment variables filled in all .env.local files
- [ ] Backend server running without errors
- [ ] Frontend builds successfully
- [ ] Payment callback URL configured in M-Pesa console
- [ ] SSL certificate obtained for production domain
- [ ] SEO meta tags and sitemap created
- [ ] Admin account email verified (splenderkimani@gmail.com)

---

## 🆘 Troubleshooting

### M-Pesa Connection Error
- Check Consumer Key and Secret
- Verify Daraja API credentials are active
- Ensure MPESA_ENV matches your account type (sandbox/production)

### Firebase Auth Error
- Verify Firebase config is correct
- Check that Google OAuth is enabled in Firebase Console
- Ensure authorized redirect URIs are configured

### Backend Won't Start
- Check all environment variables are set
- Verify port 5000 is not in use
- Check Node.js version (v16+)

### Frontend Won't Connect to Backend
- Verify CORS is enabled in backend
- Check VITE_BACKEND_URL is correct
- Ensure backend server is running

---

**Need help?** Contact: splenderkimani@gmail.com
