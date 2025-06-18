import { jwtDecode } from 'jwt-decode';

interface TokenPayload {
  exp?: number;
  iat?: number;
  sub?: string;
  iss?: string;
  aud?: string | string[];
  user?: any;
  [key: string]: any;
}

// JWT Token Utilities
export const jwtUtils = {
  // Decode JWT token
  decodeToken: (token: string): TokenPayload | null => {
    try {
      return jwtDecode(token);
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  },

  // Check if token is expired
  isTokenExpired: (token: string): boolean => {
    if (!token) return true;
    
    try {
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      
      return decoded.exp ? decoded.exp < currentTime : true;
    } catch (error) {
      console.error('Error checking token expiration:', error);
      return true;
    }
  },

  // Get token expiration time
  getTokenExpiration: (token: string): Date | null => {
    if (!token) return null;
    
    try {
      const decoded = jwtDecode(token);
      return decoded.exp ? new Date(decoded.exp * 1000) : null;
    } catch (error) {
      console.error('Error getting token expiration:', error);
      return null;
    }
  },

  // Check if token will expire soon
  isTokenExpiringSoon: (token: string, minutes: number = 5): boolean => {
    if (!token) return false;
    
    try {
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      const expirationTime = decoded.exp;
      
      if (!expirationTime) return false;
      
      return (expirationTime - currentTime) < (minutes * 60);
    } catch (error) {
      console.error('Error checking if token expires soon:', error);
      return false;
    }
  },

  // Get time until token expires (in seconds)
  getTimeUntilExpiration: (token: string): number => {
    if (!token) return 0;
    
    try {
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      const expirationTime = decoded.exp;
      
      if (!expirationTime) return 0;
      
      return Math.max(0, expirationTime - currentTime);
    } catch (error) {
      console.error('Error getting time until expiration:', error);
      return 0;
    }
  },

  // Validate token structure
  isValidTokenStructure: (token: string): boolean => {
    if (!token || typeof token !== 'string') return false;
    
    // Check if token has the correct format (header.payload.signature)
    const parts = token.split('.');
    return parts.length === 3;
  },

  // Get token payload without verification
  getTokenPayload: (token: string): TokenPayload | null => {
    if (!token) return null;
    
    try {
      const decoded = jwtDecode(token);
      return decoded;
    } catch (error) {
      console.error('Error getting token payload:', error);
      return null;
    }
  },

  // Format token expiration for display
  formatTokenExpiration: (token: string): string => {
    const expiration = jwtUtils.getTokenExpiration(token);
    if (!expiration) return 'Unknown';
    
    return expiration.toLocaleString();
  },

  // Check if token has required claims
  hasRequiredClaims: (token: string, requiredClaims: string[] = []): boolean => {
    if (!token) return false;
    
    try {
      const decoded = jwtDecode(token);
      
      for (const claim of requiredClaims) {
        if (!(claim in decoded)) {
          return false;
        }
      }
      
      return true;
    } catch (error) {
      console.error('Error checking required claims:', error);
      return false;
    }
  }
};

// Token Storage Utilities
export const tokenStorage = {
  // Store token in localStorage
  setToken: (key: string, token: string): boolean => {
    try {
      localStorage.setItem(key, token);
      return true;
    } catch (error) {
      console.error('Error storing token:', error);
      return false;
    }
  },

  // Get token from localStorage
  getToken: (key: string): string | null => {
    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.error('Error getting token:', error);
      return null;
    }
  },

  // Remove token from localStorage
  removeToken: (key: string): boolean => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error('Error removing token:', error);
      return false;
    }
  },

  // Clear all tokens
  clearAllTokens: (): boolean => {
    try {
      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (key.includes('token') || key.includes('auth'))) {
          keysToRemove.push(key);
        }
      }
      
      keysToRemove.forEach(key => localStorage.removeItem(key));
      return true;
    } catch (error) {
      console.error('Error clearing tokens:', error);
      return false;
    }
  }
};

// Authentication Helper Functions
export const authHelpers = {
  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    const accessToken = tokenStorage.getToken('access_token');
    return accessToken ? !jwtUtils.isTokenExpired(accessToken) : false;
  },

  // Get current user from token
  getCurrentUser: (): any => {
    const accessToken = tokenStorage.getToken('access_token');
    if (!accessToken) return null;
    
    const payload = jwtUtils.getTokenPayload(accessToken);
    return payload?.user || payload;
  },

  // Refresh token if needed
  refreshTokenIfNeeded: async (): Promise<boolean> => {
    const accessToken = tokenStorage.getToken('access_token');
    if (!accessToken) return false;
    
    if (jwtUtils.isTokenExpiringSoon(accessToken, 5)) {
      try {
        // Implement token refresh logic here
        // const response = await refreshToken();
        // tokenStorage.setToken('access_token', response.data.access_token);
        return true;
      } catch (error) {
        console.error('Error refreshing token:', error);
        return false;
      }
    }
    
    return true;
  },

  // Logout user
  logout: (): void => {
    tokenStorage.clearAllTokens();
    // Additional logout logic can be added here
  }
}; 