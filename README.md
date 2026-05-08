# 🦇 PICCO - Educational AI Platform

## Project Overview

PICCO is a comprehensive educational AI platform combining:
- AI-powered Q&A system (Claude/GPT-4)
- Tiered SaaS website builder with GitHub/Netlify integration
- Secure payment processing (M-Pesa & Global Currencies)
- Admin dashboard with real-time analytics
- Multilingual support (English, Spanish, Japanese, Korean, Hindi)
- Video transcription and summarization
- Document/image analysis

---

## 🎯 Core Features

### 1. Authentication & Security
- ✅ Google OAuth2 (Gmail only: @gmail.com)
- ✅ 6-digit OTP verification
- ✅ Firebase authentication
- ✅ Registered users validation

### 2. User Interface
- **Theme:** Deep Blue
- **Logo:** Batman Face Mask
- **Assistant:** Animated robot sprite
- **Multilingual:** Landing page language selector

### 3. AI Q&A Panel
- Integrate Claude API or GPT-4
- Features: Summarize, Write Briefly, Explain in Detail, Use Examples
- Multimodal input: Images (JPG/PNG), Documents (PDF/Docx), Camera
- Video transcription & summarization

### 4. Website Builder (SaaS - Tiered)
- **Pro Tier:** $10/week or $35/month
- **Plus Tier:** $25/week or $98/month
- Integrated coding environment
- GitHub & Netlify API integration
- One-click publishing
- Owner lifetime free access

### 5. Payment Integration
- **M-Pesa:** Safaricom Daraja API (STK Push)
- **Global Currencies:** Real-time exchange rates (Ksh, €, £, ¥ → USD)
- **Auto-Expiry:** 7 days (Weekly) / 30 days (Monthly)
- **Provisioning:** Instant unlock on successful payment

### 6. Admin Dashboard (splenderkimani@gmail.com only)
- User management & activity logs
- Transaction history (Google Sheets API)
- Prompt configuration (Feature toggles)
- Pop-up messaging system
- Real-time timezone clocks

### 7. Survey Section (Owner only)
- Two daily survey questions (5 sub-questions each)
- B2C M-Pesa payout: 5000Ksh per completion
- SendGrid/Nodemailer confirmation emails

---

## 📋 Technical Stack

| Component | Technology |
|-----------|------------|
| Frontend | React.js / Next.js |
| Backend | Node.js / Express.js |
| Database | Firebase / MongoDB |
| Authentication | Firebase Auth + Google OAuth2 |
| Payment | Safaricom Daraja API (M-Pesa) |
| Email | SendGrid / Nodemailer |
| Hosting | Netlify (Frontend) / Heroku/Railway (Backend) |
| AI Integration | Claude API / OpenAI GPT-4 |

---

## 📁 Project Structure

```
PICCO/
├── frontend/                 # React/Next.js application
│   ├── pages/
│   ├── components/
│   ├── styles/
│   ├── utils/
│   └── package.json
├── backend/                  # Node.js server
│   ├── routes/
│   ├── controllers/
│   ├── services/
│   ├── middleware/
│   ├── models/
│   └── server.js
├── .env.example              # Environment variables template
├── .gitignore
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js v16+
- npm or yarn
- Firebase account
- Google OAuth2 credentials
- Safaricom Daraja API account
- Claude API or OpenAI API key

### Installation

```bash
# Clone repository
git clone https://github.com/jonathan-12341/PICCO-.git
cd PICCO-

# Backend setup
cd backend
npm install
cp .env.example .env.local
# Fill in your credentials in .env.local

# Frontend setup
cd ../frontend
npm install
cp .env.example .env.local
# Fill in your credentials in .env.local
```

### Running Locally

```bash
# Terminal 1: Backend (runs on http://localhost:5000)
cd backend
npm run dev

# Terminal 2: Frontend (runs on http://localhost:3000)
cd frontend
npm run dev
```

---

## 🔐 Environment Variables

See `.env.example` for complete list. Key variables:

```
# Firebase
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=

# Google OAuth
VITE_GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# M-Pesa (Daraja)
MPESA_CONSUMER_KEY=
MPESA_CONSUMER_SECRET=
MPESA_SHORTCODE=
MPESA_PASSKEY=
MPESA_CALLBACK_URL=

# AI APIs
CLAUDE_API_KEY=
OPENAI_API_KEY=

# Email
SENDGRID_API_KEY=
NODEMAILER_USER=
NODEMAILER_PASS=

# Admin
ADMIN_EMAIL=splenderkimani@gmail.com
```

---

## 📝 Development Roadmap

### Phase 1: Foundation (Week 1-2)
- [x] Project setup & structure
- [ ] Google OAuth2 & Firebase Auth
- [ ] OTP verification system
- [ ] User registration validation

### Phase 2: Payment (Week 3-4)
- [ ] M-Pesa Daraja integration
- [ ] STK Push implementation
- [ ] B2C payout system
- [ ] Subscription auto-expiry

### Phase 3: Core Features (Week 5-6)
- [ ] AI Q&A Panel (Claude/GPT-4)
- [ ] Video transcription
- [ ] Document/image analysis
- [ ] Multilingual UI

### Phase 4: SaaS Website Builder (Week 7-8)
- [ ] Code editor UI
- [ ] GitHub API integration
- [ ] Netlify deployment API
- [ ] Tier-based access control

### Phase 5: Admin Dashboard (Week 9-10)
- [ ] User management table
- [ ] Activity logs
- [ ] Transaction history (Google Sheets)
- [ ] Feature toggle system

### Phase 6: Launch & Optimization (Week 11-12)
- [ ] SEO optimization (PICCO ranking)
- [ ] Performance tuning
- [ ] Security audit
- [ ] Production deployment

---

## 🔗 Important Links

- **Firebase Console:** https://console.firebase.google.com
- **Google OAuth Setup:** https://console.cloud.google.com
- **Safaricom Daraja:** https://developer.safaricom.co.ke
- **Claude API:** https://console.anthropic.com
- **OpenAI API:** https://platform.openai.com
- **SendGrid:** https://sendgrid.com

---

## 📞 Support

**Owner:** splenderkimani@gmail.com  
**Phone:** 0723525608  
**Repository:** https://github.com/jonathan-12341/PICCO-

---

## 📜 License

Private Project - All rights reserved to PICCO COMPANIES

---

**Last Updated:** May 8, 2026
