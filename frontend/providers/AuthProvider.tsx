import React, { createContext, useContext, useEffect, useState } from 'react';
import { SecureStorage } from '@/utils/secure-storage';
import { authApi } from '@/utils/api';
import { User, AuthState } from '@/types';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: any) => Promise<boolean>;
  logout: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStoredAuth();
  }, []);

  const loadStoredAuth = async () => {
    try {
      const token = await SecureStorage.getItemAsync('auth_token');
      const userData = await SecureStorage.getItemAsync('user_data');
      
      if (token && userData) {
        const user = JSON.parse(userData);
        
        // Verify token is still valid
        try {
          const response = await authApi.getCurrentUser();
          if (response.success && response.data) {
            setAuthState({
              user: response.data,
              token,
              isAuthenticated: true,
            });
          } else {
            // Token is invalid, clear storage
            await clearAuth();
          }
        } catch (error) {
          // Token is invalid, clear storage
          await clearAuth();
        }
      }
    } catch (error) {
      console.error('Error loading stored auth:', error);
      await clearAuth();
    } finally {
      setLoading(false);
    }
  };

  const clearAuth = async () => {
    try {
      await SecureStorage.deleteItemAsync('auth_token');
      await SecureStorage.deleteItemAsync('user_data');
    } catch (error) {
      console.error('Error clearing auth:', error);
    }
    
    setAuthState({
      user: null,
      token: null,
      isAuthenticated: false,
    });
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await authApi.login(email, password);

      if (response.success && response.data) {
        const { user, token } = response.data;
        
        await SecureStorage.setItemAsync('auth_token', token);
        await SecureStorage.setItemAsync('user_data', JSON.stringify(user));
        
        setAuthState({
          user,
          token,
          isAuthenticated: true,
        });
        
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const register = async (userData: any): Promise<boolean> => {
    try {
      const response = await authApi.register(userData);

      if (response.success && response.data) {
        const { user, token } = response.data;
        
        await SecureStorage.setItemAsync('auth_token', token);
        await SecureStorage.setItemAsync('user_data', JSON.stringify(user));
        
        setAuthState({
          user,
          token,
          isAuthenticated: true,
        });
        
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    }
  };

  const logout = async () => {
    try {
      // Call logout endpoint
      await authApi.logout();
    } catch (error) {
      console.error('Logout API error:', error);
    } finally {
      await clearAuth();
    }
  };

  return (
    <AuthContext.Provider value={{
      ...authState,
      login,
      register,
      logout,
      loading,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}