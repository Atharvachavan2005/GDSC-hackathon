# 🛡️ SafeYatra

### AI-Powered Tourist Safety Monitoring System

SafeYatra is a comprehensive platform designed to enhance tourist safety across India. It connects travelers with local authorities through real-time monitoring, AI-powered assistance, and instant emergency response capabilities.

---

## 🎯 Why SafeYatra?

India welcomes over **80 million tourists** annually, yet the safety infrastructure remains fragmented:

- **Tourists** don't know local emergency numbers or who to contact
- **Authorities** lack real-time visibility into tourist locations during emergencies
- **Families** have no way to track their loved ones while traveling
- **Response times** suffer due to communication gaps

SafeYatra solves this by creating a unified safety ecosystem where tourists, authorities, and families stay connected in real-time.

---

## ✨ Features

### 👤 For Tourists

| Feature | Description |
|---------|-------------|
| **🆘 One-Tap SOS** | Emergency button instantly shares your GPS location with nearest authorities |
| **🤖 AI Safety Assistant** | 24/7 chatbot powered by Google Gemini answers safety questions, provides emergency guidance |
| **📍 Live Location Sharing** | Share your real-time journey with family members |
| **🗺️ Interactive Safety Map** | View color-coded zones (green=safe, yellow=caution, red=high-risk) |
| **⚠️ Zone Alerts** | Get notified when entering potentially unsafe areas |
| **📴 Offline Support** | Emergency contacts and critical features work without internet |

### 👮 For Authorities

| Feature | Description |
|---------|-------------|
| **📊 Real-time Dashboard** | Monitor all registered tourists in your jurisdiction |
| **🔔 Instant SOS Alerts** | Receive emergency notifications via WebSocket (no page refresh needed) |
| **🗂️ Incident Management** | Track, assign, and resolve cases with full audit trail |
| **🔥 Heat Maps** | Visualize incident patterns to allocate resources effectively |
| **📈 Analytics** | Track response times, resolution rates, and generate reports |

### ⚙️ For Administrators

| Feature | Description |
|---------|-------------|
| **👥 User Management** | Onboard authorities, manage roles and permissions |
| **🏷️ Zone Configuration** | Define and update safety zones with risk levels |
| **💻 System Monitoring** | Track platform health, usage metrics, and performance |

---

## 🛠️ Technology Stack

### Frontend
```
React 18        → Modern UI with hooks and functional components
TypeScript      → Type-safe development, fewer runtime errors
Vite            → Lightning-fast HMR and build times
TailwindCSS     → Utility-first styling
shadcn/ui       → Beautiful, accessible component library
Leaflet         → Interactive maps with custom markers
Socket.IO       → Real-time updates without page refresh
```

### Backend
```
Node.js         → JavaScript runtime
Express.js      → Fast, minimalist web framework
TypeScript      → Type safety on server-side
sql.js          → SQLite compiled to JavaScript (no native dependencies)
Socket.IO       → WebSocket server for real-time communication
JWT             → Secure token-based authentication
bcryptjs        → Password hashing
```

### Google Cloud & AI

| Service | Usage | Cost |
|---------|-------|------|
| **Google Gemini AI** | Powers the safety chatbot - travel advice, emergency guidance, local regulations, cultural tips | Free: 60 req/min, 1M tokens/day |
| **Google Maps Platform** | Geocoding, reverse geocoding, place search | Free: $200/month credit |
| **Firebase Cloud Messaging** | Push notifications for alerts *(planned)* | Free tier available |
| **Google Cloud Run** | Serverless deployment *(planned)* | Free: 2M requests/month |

---

## 📁 Project Structure

```
SafeYatra/
│
├── 📂 frontend/                    # React Application
│   ├── 📂 src/
│   │   ├── 📂 components/          # Reusable UI components
│   │   │   ├── FloatingSOS.tsx     # Emergency SOS button
│   │   │   ├── InteractiveMap.tsx  # Leaflet map component
│   │   │   ├── SafetyZones.tsx     # Zone display component
│   │   │   └── ...
│   │   ├── 📂 pages/               # Route pages
│   │   │   ├── Index.tsx           # Landing page
│   │   │   ├── Dashboard.tsx       # User dashboard
│   │   │   ├── AuthorityDashboard.tsx
│   │   │   └── ...
│   │   ├── 📂 lib/                 # Utilities
│   │   │   ├── api.ts              # API client
│   │   │   └── utils.ts            # Helper functions
│   │   ├── 📂 contexts/            # React contexts
│   │   │   └── AuthContext.tsx     # Authentication state
│   │   └── 📂 hooks/               # Custom React hooks
│   ├── 📂 public/                  # Static assets
│   │   ├── logo.svg
│   │   └── logo-icon.svg
│   ├── .env                        # Environment variables (DO NOT COMMIT)
│   └── package.json
│
├── 📂 backend/                     # Node.js API Server
│   ├── 📂 src/
│   │   ├── 📂 routes/              # API endpoints
│   │   │   ├── auth.ts             # Authentication routes
│   │   │   ├── sos.ts              # SOS alert routes
│   │   │   ├── locations.ts        # Location tracking
│   │   │   ├── zones.ts            # Safety zones
│   │   │   ├── ai.ts               # Gemini AI integration
│   │   │   └── ...
│   │   ├── 📂 middleware/          # Express middleware
│   │   │   └── auth.ts             # JWT verification
│   │   ├── 📂 db/                  # Database layer
│   │   │   ├── connection.ts       # sql.js setup
│   │   │   ├── migrate.ts          # Schema creation
│   │   │   └── seed.ts             # Demo data
│   │   ├── 📂 socket/              # WebSocket handlers
│   │   │   └── index.ts            # Socket.IO events
│   │   └── index.ts                # App entry point
│   ├── 📂 data/                    # SQLite database files
│   ├── .env                        # Environment variables (DO NOT COMMIT)
│   └── package.json
│
├── .gitignore                      # Git ignore rules
└── README.md                       # This file
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18 or higher
- **npm**, **yarn**, or **bun** package manager
- **Google Gemini API Key** (free)

### Step 1: Clone the Repository

```bash
git clone https://github.com/your-username/safeyatra.git
cd safeyatra
```

### Step 2: Install Dependencies

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### Step 3: Get Your Gemini API Key (Free)

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click **"Create API Key"**
4. Copy the generated key

> **Free Tier Limits:** 60 requests/minute, 1 million tokens/day - more than enough for development and small-scale deployment.

### Step 4: Configure Environment Variables

Create `.env` file in `backend/` folder:
```env
PORT=3001
JWT_SECRET=your-super-secret-jwt-key-change-this
GOOGLE_AI_KEY=your-gemini-api-key-here
FRONTEND_URL=http://localhost:8080
```

Create `.env` file in `frontend/` folder:
```env
VITE_API_URL=http://localhost:3001/api
VITE_WS_URL=http://localhost:3001
VITE_GEMINI_API_KEY=your-gemini-api-key-here
```

> ⚠️ **Important:** Never commit `.env` files to git. They are already in `.gitignore`.

### Step 5: Start the Application

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### Step 6: Access the Application

| Service | URL |
|---------|-----|
| Frontend | http://localhost:8080 |
| Backend API | http://localhost:3001/api |
| Health Check | http://localhost:3001/api/health |

---

## 🔑 Demo Accounts

The application comes pre-seeded with demo accounts for testing:

| Role | Email | Password | Access |
|------|-------|----------|--------|
| **Tourist** | john.smith@gmail.com | demo123 | Tourist dashboard, SOS, AI chat |
| **Authority** | rajesh.kumar@police.gov.in | demo123 | Authority dashboard, incident management |
| **Admin** | admin@safeyatra.gov.in | demo123 | Full system access, user management |

---

## 📡 API Reference

### Authentication

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | Login, returns JWT token | No |
| GET | `/api/auth/me` | Get current user profile | Yes |
| PUT | `/api/auth/profile` | Update user profile | Yes |

### SOS Alerts

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/sos` | Create emergency alert | Yes |
| GET | `/api/sos` | Get alerts (filtered by role) | Yes |
| PATCH | `/api/sos/:id/status` | Update alert status | Yes (Authority) |

### Locations

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/locations/update` | Update user's current location | Yes |
| GET | `/api/locations/history` | Get location history | Yes |
| GET | `/api/locations/nearby` | Get nearby tourists | Yes (Authority) |

### Safety Zones

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/zones` | Get all safety zones | No |
| POST | `/api/zones` | Create new zone | Yes (Authority) |
| PUT | `/api/zones/:id` | Update zone | Yes (Authority) |
| DELETE | `/api/zones/:id` | Delete zone | Yes (Admin) |

### AI Assistant

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/ai/chat` | Send message to AI assistant | Yes |
| POST | `/api/ai/safety-score` | Get safety score for location | Yes |

---

## 🤖 AI Assistant Capabilities

The AI Safety Assistant, powered by **Google Gemini**, can help tourists with:

```
🗺️  Destination Safety    → "Is Goa safe for solo female travelers?"
🚨  Emergency Guidance    → "I lost my passport, what should I do?"
📋  Local Regulations     → "What are the photography rules at Taj Mahal?"
🌦️  Weather Information   → "Will it rain in Mumbai this week?"
🙏  Cultural Etiquette    → "What should I know before visiting a temple?"
🏥  Nearby Services       → "Where is the nearest hospital?"
📞  Emergency Contacts    → "What's the police helpline number?"
🚗  Transport Safety      → "Is it safe to take auto-rickshaws at night?"
```

---

## 🔒 Security Features

- **JWT Authentication** - Stateless, secure token-based auth
- **Password Hashing** - bcrypt with salt rounds
- **CORS Protection** - Configured for specific origins
- **Input Validation** - Request sanitization on all endpoints
- **Role-Based Access** - Tourist, Authority, Admin permission levels
- **Secure WebSocket** - Authenticated socket connections

---

## 🗺️ Roadmap

### ✅ Phase 1: MVP (Completed)
- [x] User authentication (Tourist, Authority, Admin)
- [x] Real-time SOS alerts with WebSocket
- [x] Interactive map with safety zones
- [x] AI-powered safety chatbot (Gemini)
- [x] Authority dashboard
- [x] Location tracking

### 🔄 Phase 2: Enhancement (Planned)
- [ ] Mobile app (React Native)
- [ ] Offline-first architecture with sync
- [ ] Push notifications (Firebase)
- [ ] Multi-language support (Hindi, Tamil, Telugu)
- [ ] Integration with 112 emergency services
- [ ] SMS fallback for SOS

### 🚀 Phase 3: Scale (Future)
- [ ] ML-based risk prediction
- [ ] Crowd density monitoring
- [ ] AR navigation for tourists
- [ ] Blockchain-based incident records
- [ ] Pan-India deployment

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 👥 Team

Built with ❤️ by **Team SafeYatra**

---

<div align="center">

### 🛡️ SafeYatra - *Protecting Every Journey*

**Making India a safer destination for every traveler**

</div>
