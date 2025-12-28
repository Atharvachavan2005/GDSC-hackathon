# 🛡️ SafeYatra - AI-Powered Tourist Safety Monitoring System

> Smart Tourism Safety Solution for India

---

## 🎯 The Problem

Every year, millions of tourists visit India but face fragmented safety systems. When emergencies happen, tourists struggle to find help, authorities lack real-time visibility, and there's no unified platform for coordinated response. This affects tourism confidence and puts lives at risk.

**SafeYatra** bridges this gap with AI-powered monitoring, instant SOS alerts, and real-time coordination between tourists and authorities.

---

## 🚀 Core Features

### For Tourists
- **One-Tap SOS** - Emergency button sends GPS coordinates to nearest authorities instantly
- **AI Safety Companion** - Gemini-powered chatbot answers travel safety questions 24/7
- **Live Location Sharing** - Share your journey with family in real-time
- **Safety Zone Alerts** - Get notified when entering high-risk areas
- **Offline Mode** - Critical features work without internet

### For Authorities  
- **Real-time Dashboard** - Monitor all active tourists in your jurisdiction
- **SOS Management** - Receive, assign, and track emergency alerts
- **Heat Maps** - Visualize incident patterns and high-risk zones
- **Analytics** - Track response times and generate reports

### For Admins
- **User Management** - Onboard authorities and manage access
- **Zone Configuration** - Define safety zones with risk levels
- **System Health** - Monitor platform usage and performance

---

## 🔧 Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| React 18 + TypeScript | UI framework with type safety |
| Vite | Lightning-fast build tool |
| TailwindCSS + shadcn/ui | Modern styling and components |
| Socket.IO Client | Real-time WebSocket updates |
| Leaflet | Interactive maps |

### Backend
| Technology | Purpose |
|------------|---------|
| Node.js + Express | API server |
| TypeScript | Type-safe backend code |
| sql.js | SQLite database (pure JS) |
| Socket.IO | Real-time communication |
| JWT + bcrypt | Secure authentication |

### 🔴 Google Technologies

| Service | How We Use It | Free Tier |
|---------|--------------|-----------|
| **Google Gemini AI** | Powers our safety chatbot - provides travel advice, emergency guidance, local safety info, cultural tips | 60 requests/min, 1M tokens/day FREE |
| **Google Maps Platform** | Geocoding, reverse geocoding, place search for location-based features | $200/month free credit |
| **Firebase Cloud Messaging** | Push notifications for SOS alerts (planned) | Generous free tier |
| **Google Cloud Run** | Serverless deployment option (planned) | 2M requests/month FREE |

---

## 📁 Project Structure

```
GDSC hackathon/
├── frontend/                 # React frontend
│   ├── src/
│   │   ├── components/       # UI components
│   │   ├── pages/           # Route pages  
│   │   ├── lib/             # API client & utils
│   │   └── contexts/        # React contexts
│   └── public/              # Static assets
├── backend/                  # Node.js API
│   ├── src/
│   │   ├── routes/          # API endpoints
│   │   ├── middleware/      # Auth middleware
│   │   ├── db/              # Database setup
│   │   └── socket/          # WebSocket handlers
│   └── data/                # SQLite database
└── README.md
```

---

## ⚡ Quick Start

### Prerequisites
- Node.js 18+ 
- npm or bun

### Step 1: Install Dependencies

```bash
# Backend
cd backend && npm install

# Frontend
cd ../frontend && npm install
```

### Step 2: Configure Environment

**Backend** (`backend/.env`):
```env
PORT=3001
JWT_SECRET=safeyatra-secret-2025
GOOGLE_AI_KEY=your-gemini-api-key
FRONTEND_URL=http://localhost:8080
```

**Frontend** (`frontend/.env`):
```env
VITE_API_URL=http://localhost:3001/api
VITE_WS_URL=http://localhost:3001
VITE_GEMINI_API_KEY=your-gemini-api-key
```

### Step 3: Get Gemini API Key (FREE)

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with Google account
3. Click "Create API Key"
4. Copy to your `.env` files

**Free Limits:** 60 requests/min, 1 million tokens/day

### Step 4: Run the App

```bash
# Terminal 1 - Backend
cd backend && npm run dev

# Terminal 2 - Frontend  
cd frontend && npm run dev
```

🌐 **Frontend:** http://localhost:8080  
🔌 **Backend API:** http://localhost:3001/api

---

## 🔑 Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| **Tourist** | john.smith@gmail.com | demo123 |
| **Authority** | rajesh.kumar@police.gov.in | demo123 |
| **Admin** | admin@safeyatra.gov.in | demo123 |

---

## 📡 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/register` | POST | Register new user |
| `/api/auth/login` | POST | Login & get JWT |
| `/api/auth/me` | GET | Get current user |
| `/api/sos` | POST | Create SOS alert |
| `/api/sos` | GET | Get alerts (role-based) |
| `/api/sos/:id/status` | PATCH | Update alert status |
| `/api/locations/update` | POST | Update user location |
| `/api/zones` | GET | Get safety zones |
| `/api/ai/chat` | POST | Chat with AI assistant |

---

## 🤖 AI Chatbot Capabilities

Powered by **Google Gemini**, the safety assistant helps with:

- 🗺️ **Destination Info** - "Is Jaipur safe at night?"
- 🚨 **Emergency Help** - "I lost my passport, what do I do?"
- 📋 **Local Laws** - "What are the rules for photography here?"
- 🌦️ **Weather Alerts** - "Will there be rain in Mumbai this week?"
- 🙏 **Cultural Tips** - "What should I know before visiting a temple?"
- 🏥 **Nearby Help** - "Where's the nearest hospital?"

---


---

## 👥 Team SafeYatra

Built with ❤️ for **GDSC Solution Challenge /**

---

## 📄 License

MIT License - Open source and free to use

---

**SafeYatra** - *Protecting Every Journey* 🇮🇳
