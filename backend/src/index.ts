import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { initDatabase } from './db/connection.js';
import { runMigrations } from './db/migrate.js';
import { seedDatabase } from './db/seed.js';
import { initializeSocket } from './socket/index.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';

// Routes
import authRoutes from './routes/auth.js';
import touristRoutes from './routes/tourists.js';
import sosRoutes from './routes/sos.js';
import locationRoutes from './routes/locations.js';
import zoneRoutes from './routes/zones.js';
import alertRoutes from './routes/alerts.js';
import aiRoutes from './routes/ai.js';
import notificationRoutes from './routes/notifications.js';

const app = express();
const httpServer = createServer(app);
const PORT = process.env.PORT || 3001;

// Initialize database asynchronously
async function initApp() {
  await initDatabase();
  console.log('✅ Database initialized');
  
  runMigrations();
  
  // Seed with initial data
  seedDatabase();
}

initApp().catch(console.error);

// Initialize WebSocket
initializeSocket(httpServer);

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || ['http://localhost:8080', 'http://localhost:8081', 'http://localhost:5173'],
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`${req.method} ${req.path} ${res.statusCode} - ${duration}ms`);
  });
  next();
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    service: 'SafeYatra API'
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/tourists', touristRoutes);
app.use('/api/sos', sosRoutes);
app.use('/api/locations', locationRoutes);
app.use('/api/zones', zoneRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/notifications', notificationRoutes);

// API documentation endpoint
app.get('/api', (req, res) => {
  res.json({
    name: 'SafeYatra API',
    version: '1.0.0',
    description: 'AI-Powered Tourist Safety Monitoring System',
    endpoints: {
      auth: {
        'POST /api/auth/register': 'Register new user',
        'POST /api/auth/login': 'Login user',
        'GET /api/auth/me': 'Get current user',
        'PUT /api/auth/profile': 'Update profile',
        'PUT /api/auth/change-password': 'Change password'
      },
      tourists: {
        'GET /api/tourists': 'Get all tourists (authority)',
        'GET /api/tourists/:id': 'Get tourist by ID',
        'GET /api/tourists/live/map': 'Get live tourist locations',
        'GET /api/tourists/stats/dashboard': 'Get dashboard statistics'
      },
      sos: {
        'GET /api/sos': 'Get all SOS alerts',
        'POST /api/sos': 'Create SOS alert',
        'GET /api/sos/:id': 'Get SOS alert details',
        'PATCH /api/sos/:id/status': 'Update SOS status',
        'GET /api/sos/user/history': 'Get user SOS history'
      },
      locations: {
        'POST /api/locations/update': 'Update location',
        'GET /api/locations/history': 'Get location history',
        'GET /api/locations/last': 'Get last location',
        'POST /api/locations/sync': 'Sync offline locations',
        'GET /api/locations/area': 'Get tourists in area'
      },
      zones: {
        'GET /api/zones': 'Get all safety zones',
        'GET /api/zones/:id': 'Get zone details',
        'POST /api/zones': 'Create zone (authority)',
        'PUT /api/zones/:id': 'Update zone',
        'GET /api/zones/safe-spaces/all': 'Get all safe spaces',
        'GET /api/zones/safe-spaces/nearest': 'Get nearest safe space'
      },
      alerts: {
        'GET /api/alerts': 'Get safety alerts',
        'GET /api/alerts/location': 'Get alerts for location',
        'POST /api/alerts': 'Create safety alert (authority)'
      },
      ai: {
        'POST /api/ai/chat': 'Chat with AI assistant',
        'GET /api/ai/history': 'Get chat history',
        'GET /api/ai/safety-tips': 'Get safety tips',
        'GET /api/ai/emergency-info': 'Get emergency information'
      },
      notifications: {
        'GET /api/notifications': 'Get notifications',
        'PATCH /api/notifications/:id/read': 'Mark as read',
        'PATCH /api/notifications/read-all': 'Mark all as read',
        'DELETE /api/notifications/:id': 'Delete notification'
      }
    },
    websocket: {
      events: {
        'location_update': 'Send location updates',
        'sos_trigger': 'Trigger SOS alert',
        'new_sos_alert': 'Receive new SOS alerts',
        'sos_acknowledged': 'SOS acknowledgement notification',
        'safety_alert': 'Receive safety alerts',
        'tourist_location_update': 'Real-time tourist tracking'
      }
    }
  });
});

// 404 handler
app.use(notFoundHandler);

// Error handler
app.use(errorHandler);

// Start server
httpServer.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║   🛡️  SafeYatra Backend API Server                         ║
║                                                            ║
║   Server running on: http://localhost:${PORT}                ║
║   API Documentation: http://localhost:${PORT}/api            ║
║   Health Check: http://localhost:${PORT}/api/health          ║
║                                                            ║
║   WebSocket: ws://localhost:${PORT}                          ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
  `);
});

export default app;
