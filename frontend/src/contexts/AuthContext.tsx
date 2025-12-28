import React, { createContext, useContext, useState, useEffect } from 'react';
import { api, getToken, setToken, removeToken, setStoredUser, getStoredUser } from '../lib/api';
import { initializeSocket, disconnectSocket } from '../lib/socket';

type UserRole = 'tourist' | 'authority' | 'admin' | null;

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  avatar?: string;
  emergencyContact?: string;
  emergencyPhone?: string;
  bloodGroup?: string;
  profile?: any;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: { email: string; password: string; name: string; phone?: string; role?: string }) => Promise<void>;
  logout: () => void;
  updateProfile: (data: any) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = getToken();
      if (token) {
        try {
          const { user: userData } = await api.auth.me();
          setUser({
            id: userData.id,
            name: userData.name,
            email: userData.email,
            phone: userData.phone,
            role: userData.role,
            avatar: userData.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${userData.email}`,
            emergencyContact: userData.emergency_contact,
            emergencyPhone: userData.emergency_phone,
            bloodGroup: userData.blood_group,
            profile: userData.profile,
          });
          // Initialize WebSocket
          initializeSocket();
        } catch (error) {
          console.error('Auth check failed:', error);
          removeToken();
        }
      }
      setIsLoading(false);
    };
    
    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { user: userData, token } = await api.auth.login(email, password);
      
      setToken(token);
      setStoredUser(userData);
      
      const userObj: User = {
        id: userData.id,
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        role: userData.role,
        avatar: userData.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${userData.email}`,
        emergencyContact: userData.emergency_contact,
        emergencyPhone: userData.emergency_phone,
        profile: userData.profile,
      };
      
      setUser(userObj);
      
      // Initialize WebSocket after login
      initializeSocket();
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: { email: string; password: string; name: string; phone?: string; role?: string }) => {
    setIsLoading(true);
    try {
      const { user: newUser, token } = await api.auth.register(userData);
      
      setToken(token);
      setStoredUser(newUser);
      
      const userObj: User = {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone || '',
        role: newUser.role,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${newUser.email}`,
      };
      
      setUser(userObj);
      
      // Initialize WebSocket after registration
      initializeSocket();
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    removeToken();
    disconnectSocket();
  };

  const updateProfile = async (data: any) => {
    await api.auth.updateProfile(data);
    // Refresh user data
    const { user: userData } = await api.auth.me();
    setUser({
      id: userData.id,
      name: userData.name,
      email: userData.email,
      phone: userData.phone,
      role: userData.role,
      avatar: userData.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${userData.email}`,
      emergencyContact: userData.emergency_contact,
      emergencyPhone: userData.emergency_phone,
      bloodGroup: userData.blood_group,
      profile: userData.profile,
    });
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      isLoading,
      login,
      register,
      logout,
      updateProfile,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
