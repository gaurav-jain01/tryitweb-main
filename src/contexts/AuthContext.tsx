import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

interface User {
  id: string;
  name: string;
  email: string;
}

interface TokenInfo {
  iat: number;
  exp: number;
  sub?: string;
  iss?: string;
  aud?: string | string[];
  roles?: string[] | string;
  isValid: boolean;
  isExpiringSoon: boolean;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  getTokenInfo: () => TokenInfo | null;
  error: string | null;
  clearError: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

// Helper function to validate JWT token format
const isValidJWTFormat = (token: string): boolean => {
  try {
    // Check if token has the correct format (3 parts separated by dots)
    const parts = token.split('.');
    if (parts.length !== 3) {
      return false;
    }
    
    // Check if all parts are valid base64
    parts.forEach(part => {
      if (!part || part.trim() === '') {
        return false;
      }
      // Try to decode base64
      atob(part.replace(/-/g, '+').replace(/_/g, '/'));
    });
    
    return true;
  } catch (error) {
    return false;
  }
};

// Mock user storage
const MOCK_USERS_KEY = 'mockUsers';
const getMockUsers = (): Record<string, { name: string; email: string; password: string }> => {
  const stored = localStorage.getItem(MOCK_USERS_KEY);
  return stored ? JSON.parse(stored) : {};
};

const saveMockUsers = (users: Record<string, { name: string; email: string; password: string }>) => {
  localStorage.setItem(MOCK_USERS_KEY, JSON.stringify(users));
};

// Generate a mock JWT token
const generateMockToken = (user: User): string => {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = btoa(JSON.stringify({
    userId: user.id,
    name: user.name,
    email: user.email,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 hours
  }));
  const signature = btoa('mock-signature');
  
  return `${header}.${payload}.${signature}`;
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Check if we have API credentials
  const hasApiCredentials = process.env.REACT_APP_API_LINK;

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        // First validate the token format
        if (!isValidJWTFormat(token)) {
          console.warn('Invalid JWT format, removing token');
          localStorage.removeItem('token');
          setLoading(false);
          return;
        }

        const decoded = jwtDecode(token) as any;
        const currentTime = Date.now() / 1000;
        
        if (decoded.exp > currentTime) {
          setUser({
            id: decoded.userId || decoded.sub || 'unknown',
            name: decoded.name || 'User',
            email: decoded.email || 'user@example.com'
          });
        } else {
          console.warn('Token expired, removing from storage');
          localStorage.removeItem('token');
        }
      } catch (error) {
        console.error('Token decode error:', error);
        // Remove invalid token from storage
        localStorage.removeItem('token');
      }
    }
    setLoading(false);
  }, []);

  const getTokenInfo = (): TokenInfo | null => {
    const token = localStorage.getItem('token');
    if (!token) return null;

    try {
      // Validate token format first
      if (!isValidJWTFormat(token)) {
        return null;
      }

      const decoded = jwtDecode(token) as any;
      const currentTime = Date.now() / 1000;
      
      return {
        iat: decoded.iat || 0,
        exp: decoded.exp || 0,
        sub: decoded.sub,
        iss: decoded.iss,
        aud: decoded.aud,
        roles: decoded.roles,
        isValid: decoded.exp > currentTime,
        isExpiringSoon: decoded.exp - currentTime < 300 // 5 minutes
      };
    } catch (error) {
      console.error('Error getting token info:', error);
      return null;
    }
  };

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      setError(null);
      
      if (hasApiCredentials) {
        // Real API call
        const response = await axios.post(
          `${process.env.REACT_APP_API_LINK}/auth/login`,
          { email, password }
        );

        const { token, user: userData } = response.data;
        
        // Validate token before storing
        if (!isValidJWTFormat(token)) {
          throw new Error('Invalid token received from server');
        }
        
        localStorage.setItem('token', token);
        
        setUser({
          id: userData.id,
          name: userData.name,
          email: userData.email
        });
      } else {
        // Mock authentication
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const mockUsers = getMockUsers();
        const userData = mockUsers[email];
        
        if (!userData) {
          throw new Error('No account found with this email. Please check your email or sign up for a new account.');
        }
        
        if (userData.password !== password) {
          throw new Error('Incorrect password. Please check your password and try again.');
        }
        
        const user: User = {
          id: email, // Use email as ID for simplicity
          name: userData.name,
          email: userData.email
        };
        
        const token = generateMockToken(user);
        localStorage.setItem('token', token);
        setUser(user);
      }

      return { success: true };
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Login failed. Please try again.';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const signup = async (name: string, email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      setError(null);
      
      if (hasApiCredentials) {
        // Real API call
        const response = await axios.post(
          `${process.env.REACT_APP_API_LINK}/auth/signup`,
          { name, email, password }
        );

        // For real API, we don't automatically log in after signup
        // User needs to login separately
        return { success: true };
      } else {
        // Mock authentication
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const mockUsers = getMockUsers();
        
        if (mockUsers[email]) {
          throw new Error('An account with this email already exists. Please login instead or use a different email.');
        }
        
        // Add new user to mock storage
        mockUsers[email] = { name, email, password };
        saveMockUsers(mockUsers);
        
        // Don't automatically log in the user after signup
        // They need to login separately
        return { success: true };
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Signup failed. Please try again.';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const logout = () => {
    // Clear all authentication data
    localStorage.removeItem('token');
    setUser(null);
    setError(null);
    
    // Force a complete page refresh and redirect to login
    // This ensures all state is cleared and the app starts fresh
    window.location.replace('/login');
  };

  const clearError = () => {
    setError(null);
  };

  const value: AuthContextType = {
    user,
    login,
    signup,
    logout,
    getTokenInfo,
    error,
    clearError,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 