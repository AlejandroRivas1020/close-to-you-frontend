import React, { createContext, useState, useEffect, useContext } from 'react';
import authService from '../services/authService';

interface AuthContextProps {
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  getToken: () => Promise<string | null>;
  register: (name: string, email: string, password: string) => Promise<void>;
  loading: boolean;
}


const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuthStatus = async () => {
      const token = await authService.getToken();
      setIsAuthenticated(!!token);
      setLoading(false);
    };

    checkAuthStatus();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    const success = await authService.login({ email, password });
    if (success) {
      setIsAuthenticated(true);
    }
    return success;
  };

  const logout = async (): Promise<void> => {
    await authService.logout();
    setIsAuthenticated(false);
  };

  const getToken = async (): Promise<string | null> => {
    return await authService.getToken();
  };

  const register = async (name: string, email: string, password: string): Promise<void> => {
    try {
      const message = await authService.register({ name, email, password });
      if (message === 'User registered successfully') {
      }
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, getToken, loading, register }}>
      {loading ? null : children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextProps => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
