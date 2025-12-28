import { Server as HttpServer } from 'http';
import { Server, Socket } from 'socket.io';
import { verifyToken, JWTPayload } from '../middleware/auth.js';
import { getDatabase, saveDatabase } from '../db/connection.js';
import { v4 as uuidv4 } from 'uuid';

let io: Server | null = null;

interface AuthenticatedSocket extends Socket {
  user?: JWTPayload;
}

export function initializeSocket(httpServer: HttpServer): Server {
  io = new Server(httpServer, {
    cors: {
      origin: process.env.FRONTEND_URL || ['http://localhost:8080', 'http://localhost:8081', 'http://localhost:5173'],
      methods: ['GET', 'POST'],
      credentials: true
    },
    pingTimeout: 60000,
    pingInterval: 25000
  });
  
  // Authentication middleware
  io.use((socket: AuthenticatedSocket, next) => {
    const token = socket.handshake.auth.token;
    
    if (!token) {
      return next(new Error('Authentication required'));
    }
    
    const decoded = verifyToken(token);
    if (!decoded) {
      return next(new Error('Invalid token'));
    }
    
    socket.user = decoded;
    next();
  });
  
  io.on('connection', (socket: AuthenticatedSocket) => {
    const user = socket.user!;
    console.log(`🔌 User connected: ${user.name} (${user.role})`);
    
    // Join role-based rooms
    if (user.role === 'authority') {
      socket.join('authorities');
    } else if (user.role === 'admin') {
      socket.join('admin');
      socket.join('authorities');
    }
    
    // Join personal room for direct messages
    socket.join(`user_${user.id}`);
    
    // Handle location updates from tourists
    socket.on('location_update', (data: { latitude: number; longitude: number; placeName?: string; batteryLevel?: number }) => {
      if (user.role !== 'tourist') return;
      
      const db = getDatabase();
      
      // Save location to database
      db.run(`
        INSERT INTO locations (id, user_id, latitude, longitude, place_name, battery_level, zone_type)
        VALUES (?, ?, ?, ?, ?, ?, 'safe')
      `, [uuidv4(), user.id, data.latitude, data.longitude, data.placeName || null, data.batteryLevel || null]);
      
      saveDatabase();
      
      // Broadcast to authorities for real-time tracking
      socket.to('authorities').emit('tourist_location_update', {
        touristId: user.id,
        touristName: user.name,
        ...data,
        timestamp: new Date().toISOString()
      });
    });
    
    // Handle SOS trigger
    socket.on('sos_trigger', (data: { latitude: number; longitude: number; alertType: string; description?: string }) => {
      console.log(`🚨 SOS triggered by ${user.name}`);
      
      // Broadcast to all authorities
      io?.to('authorities').emit('new_sos_alert', {
        userId: user.id,
        userName: user.name,
        ...data,
        status: 'active',
        createdAt: new Date().toISOString()
      });
    });
    
    // Handle SOS acknowledgement by authority
    socket.on('sos_acknowledge', (data: { alertId: string }) => {
      if (user.role !== 'authority' && user.role !== 'admin') return;
      
      // Get alert details
      const db = getDatabase();
      const stmt = db.prepare('SELECT user_id FROM sos_alerts WHERE id = ?');
      stmt.bind([data.alertId]);
      let alertUserId = null;
      if (stmt.step()) {
        alertUserId = stmt.get()[0];
      }
      stmt.free();
      
      if (alertUserId) {
        // Notify the tourist
        io?.to(`user_${alertUserId}`).emit('sos_acknowledged', {
          alertId: data.alertId,
          acknowledgedBy: user.name,
          timestamp: new Date().toISOString()
        });
      }
    });
    
    // Handle typing indicator for chat
    socket.on('typing_start', (data: { chatId: string }) => {
      socket.broadcast.emit('user_typing', { userId: user.id, userName: user.name, chatId: data.chatId });
    });
    
    socket.on('typing_stop', (data: { chatId: string }) => {
      socket.broadcast.emit('user_stopped_typing', { userId: user.id, chatId: data.chatId });
    });
    
    // Handle disconnection
    socket.on('disconnect', (reason) => {
      console.log(`🔌 User disconnected: ${user.name} (${reason})`);
      
      // Update last seen
      const db = getDatabase();
      db.run('UPDATE users SET updated_at = datetime("now") WHERE id = ?', [user.id]);
      saveDatabase();
      
      // Notify authorities if a tourist disconnects
      if (user.role === 'tourist') {
        socket.to('authorities').emit('tourist_offline', {
          touristId: user.id,
          touristName: user.name,
          timestamp: new Date().toISOString()
        });
      }
    });
    
    // Handle errors
    socket.on('error', (error) => {
      console.error(`Socket error for ${user.name}:`, error);
    });
  });
  
  console.log('🔌 WebSocket server initialized');
  return io;
}

export function getSocketIO(): Server | null {
  return io;
}

export function broadcastToAuthorities(event: string, data: any): void {
  if (io) {
    io.to('authorities').emit(event, data);
  }
}

export function broadcastToUser(userId: string, event: string, data: any): void {
  if (io) {
    io.to(`user_${userId}`).emit(event, data);
  }
}

export function broadcastToAll(event: string, data: any): void {
  if (io) {
    io.emit(event, data);
  }
}
