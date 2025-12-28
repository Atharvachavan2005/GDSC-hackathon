// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
export const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:3001';

// Storage keys
export const TOKEN_KEY = 'safeyatra_token';
export const USER_KEY = 'safeyatra_user';

// Get stored token
export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

// Set token
export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

// Remove token
export function removeToken(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

// Get stored user
export function getStoredUser(): any | null {
  const user = localStorage.getItem(USER_KEY);
  return user ? JSON.parse(user) : null;
}

// Set user
export function setStoredUser(user: any): void {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

// API request helper with auth
export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  
  if (token) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
  }
  
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });
  
  const data = await response.json();
  
  if (!response.ok) {
    // Handle token expiration
    if (response.status === 401) {
      removeToken();
      window.location.href = '/auth';
    }
    throw new Error(data.error || 'API request failed');
  }
  
  return data;
}

// API Methods
export const api = {
  // Auth
  auth: {
    login: (email: string, password: string) =>
      apiRequest<{ user: any; token: string }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      }),
    
    register: (data: { email: string; password: string; name: string; phone?: string; role?: string }) =>
      apiRequest<{ user: any; token: string }>('/auth/register', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    
    me: () => apiRequest<{ user: any }>('/auth/me'),
    
    updateProfile: (data: any) =>
      apiRequest('/auth/profile', {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
  },
  
  // SOS
  sos: {
    create: (data: { latitude: number; longitude: number; alertType?: string; description?: string }) =>
      apiRequest<{ alert: any }>('/sos', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    
    getAll: (params?: { status?: string; type?: string; page?: number }) => {
      const searchParams = new URLSearchParams(params as any);
      return apiRequest<{ alerts: any[]; pagination: any }>(`/sos?${searchParams}`);
    },
    
    getById: (id: string) => apiRequest<{ alert: any }>(`/sos/${id}`),
    
    updateStatus: (id: string, status: string, resolutionNotes?: string) =>
      apiRequest(`/sos/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status, resolutionNotes }),
      }),
    
    getHistory: () => apiRequest<{ alerts: any[] }>('/sos/user/history'),
    
    getActiveCount: () => apiRequest<{ active: number; responding: number; total: number }>('/sos/active/count'),
  },
  
  // Locations
  locations: {
    update: (data: { latitude: number; longitude: number; placeName?: string; batteryLevel?: number }) =>
      apiRequest<{ locationId: string; zoneType: string }>('/locations/update', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    
    getHistory: (params?: { limit?: number }) => {
      const searchParams = new URLSearchParams(params as any);
      return apiRequest<{ locations: any[] }>(`/locations/history?${searchParams}`);
    },
    
    getLast: () => apiRequest<{ location: any }>('/locations/last'),
    
    sync: (locations: any[]) =>
      apiRequest<{ syncedIds: string[] }>('/locations/sync', {
        method: 'POST',
        body: JSON.stringify({ locations }),
      }),
  },
  
  // Zones
  zones: {
    getAll: (params?: { type?: string }) => {
      const searchParams = new URLSearchParams(params as any);
      return apiRequest<{ zones: any[] }>(`/zones?${searchParams}`);
    },
    
    getById: (id: string) => apiRequest<{ zone: any; currentTourists: number }>(`/zones/${id}`),
    
    getNearby: (lat: number, lng: number, radius?: number) =>
      apiRequest<{ zones: any[] }>(`/zones/near/location?lat=${lat}&lng=${lng}&radius=${radius || 5000}`),
    
    getSafeSpaces: (params?: { type?: string; lat?: number; lng?: number; radius?: number }) => {
      const searchParams = new URLSearchParams(params as any);
      return apiRequest<{ spaces: any[] }>(`/zones/safe-spaces/all?${searchParams}`);
    },
    
    getNearestSafeSpace: (lat: number, lng: number, type?: string) =>
      apiRequest<{ spaces: any[] }>(`/zones/safe-spaces/nearest?lat=${lat}&lng=${lng}${type ? `&type=${type}` : ''}`),
  },
  
  // Alerts
  alerts: {
    getAll: (params?: { active?: boolean; level?: string }) => {
      const searchParams = new URLSearchParams(params as any);
      return apiRequest<{ alerts: any[] }>(`/alerts?${searchParams}`);
    },
    
    getForLocation: (lat: number, lng: number) =>
      apiRequest<{ alerts: any[] }>(`/alerts/location?lat=${lat}&lng=${lng}`),
    
    create: (data: { title: string; message: string; alertLevel: string; latitude?: number; longitude?: number; radius?: number }) =>
      apiRequest<{ alert: any }>('/alerts', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
  },
  
  // AI Assistant
  ai: {
    chat: (message: string, context?: any) =>
      apiRequest<{ id: string; response: string }>('/ai/chat', {
        method: 'POST',
        body: JSON.stringify({ message, context }),
      }),
    
    getHistory: (limit?: number) =>
      apiRequest<{ messages: any[] }>(`/ai/history?limit=${limit || 50}`),
    
    getSafetyTips: (category?: string) =>
      apiRequest<{ tips: any }>(`/ai/safety-tips${category ? `?category=${category}` : ''}`),
    
    getEmergencyInfo: () => apiRequest<any>('/ai/emergency-info'),
  },
  
  // Tourists (for authorities)
  tourists: {
    getAll: (params?: { page?: number; limit?: number; search?: string }) => {
      const searchParams = new URLSearchParams(params as any);
      return apiRequest<{ tourists: any[]; pagination: any }>(`/tourists?${searchParams}`);
    },
    
    getById: (id: string) => apiRequest<{ tourist: any; locations: any[]; sosHistory: any[] }>(`/tourists/${id}`),
    
    getLive: (params?: { bounds?: string; zoneType?: string }) => {
      const searchParams = new URLSearchParams(params as any);
      return apiRequest<{ tourists: any[]; count: number }>(`/tourists/live/map?${searchParams}`);
    },
    
    getStats: () => apiRequest<{ stats: any; zoneStats: any[]; alertsByType: any[] }>('/tourists/stats/dashboard'),
  },
  
  // Notifications
  notifications: {
    getAll: (unreadOnly?: boolean) =>
      apiRequest<{ notifications: any[]; unreadCount: number }>(`/notifications?unreadOnly=${unreadOnly || false}`),
    
    markRead: (id: string) =>
      apiRequest(`/notifications/${id}/read`, { method: 'PATCH' }),
    
    markAllRead: () =>
      apiRequest('/notifications/read-all', { method: 'PATCH' }),
    
    delete: (id: string) =>
      apiRequest(`/notifications/${id}`, { method: 'DELETE' }),
  },
};

export default api;
