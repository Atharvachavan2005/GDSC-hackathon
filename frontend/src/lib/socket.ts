import { io, Socket } from 'socket.io-client';
import { getToken, WS_URL } from './api';

let socket: Socket | null = null;

export function initializeSocket(): Socket {
  if (socket?.connected) {
    return socket;
  }
  
  const token = getToken();
  
  socket = io(WS_URL || 'http://localhost:3001', {
    auth: { token },
    transports: ['websocket', 'polling'],
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
  });
  
  socket.on('connect', () => {
    console.log('🔌 WebSocket connected');
  });
  
  socket.on('disconnect', (reason) => {
    console.log('🔌 WebSocket disconnected:', reason);
  });
  
  socket.on('connect_error', (error) => {
    console.error('WebSocket connection error:', error);
  });
  
  return socket;
}

export function getSocket(): Socket | null {
  return socket;
}

export function disconnectSocket(): void {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}

// Location tracking
export function sendLocationUpdate(data: {
  latitude: number;
  longitude: number;
  placeName?: string;
  batteryLevel?: number;
}): void {
  if (socket?.connected) {
    socket.emit('location_update', data);
  }
}

// SOS trigger
export function triggerSOS(data: {
  latitude: number;
  longitude: number;
  alertType: string;
  description?: string;
}): void {
  if (socket?.connected) {
    socket.emit('sos_trigger', data);
  }
}

// Subscribe to events
export function onNewSOSAlert(callback: (alert: any) => void): void {
  socket?.on('new_sos_alert', callback);
}

export function onSOSUpdated(callback: (data: any) => void): void {
  socket?.on('sos_alert_updated', callback);
}

export function onSOSAcknowledged(callback: (data: any) => void): void {
  socket?.on('sos_acknowledged', callback);
}

export function onSafetyAlert(callback: (alert: any) => void): void {
  socket?.on('safety_alert', callback);
}

export function onTouristLocationUpdate(callback: (data: any) => void): void {
  socket?.on('tourist_location_update', callback);
}

export function onTouristOffline(callback: (data: any) => void): void {
  socket?.on('tourist_offline', callback);
}

// Unsubscribe from events
export function offNewSOSAlert(callback?: (alert: any) => void): void {
  socket?.off('new_sos_alert', callback);
}

export function offTouristLocationUpdate(callback?: (data: any) => void): void {
  socket?.off('tourist_location_update', callback);
}

export default {
  initialize: initializeSocket,
  get: getSocket,
  disconnect: disconnectSocket,
  sendLocation: sendLocationUpdate,
  triggerSOS,
  on: {
    newSOSAlert: onNewSOSAlert,
    sosUpdated: onSOSUpdated,
    sosAcknowledged: onSOSAcknowledged,
    safetyAlert: onSafetyAlert,
    touristLocation: onTouristLocationUpdate,
    touristOffline: onTouristOffline,
  },
  off: {
    newSOSAlert: offNewSOSAlert,
    touristLocation: offTouristLocationUpdate,
  },
};
