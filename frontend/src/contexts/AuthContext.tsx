import React, { createContext, useContext, useState, useRef } from 'react';
import {
  performClientLogout,
  type LogoutResponse,
} from '../services/auth.service';

interface AuthState {
  token: string | null;
  role: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

interface AuthContextType extends AuthState {
  login: (token: string, role: string, refreshToken?: string | null) => void;
  logout: () => Promise<LogoutResponse>;
  isLoggingOut: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>(() => {
    const storedToken = localStorage.getItem('token');
    const storedRole = localStorage.getItem('role');

    if (storedToken && storedRole) {
      return {
        token: storedToken,
        role: storedRole,
        isAuthenticated: true,
        isAdmin: storedRole === 'admin' || storedRole === 'super_admin',
      };
    }
    return {
      token: null,
      role: null,
      isAuthenticated: false,
      isAdmin: false,
    };
  });

  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const activeLogoutRef = useRef<Promise<LogoutResponse> | null>(null);

  const login = (token: string, role: string, refreshToken?: string | null) => {
    localStorage.setItem('token', token);
    localStorage.setItem('role', role);
    if (refreshToken) {
      localStorage.setItem('refreshToken', refreshToken);
    }
    setAuthState({
      token,
      role,
      isAuthenticated: true,
      isAdmin: role === 'admin' || role === 'super_admin',
    });
  };

  const logout = async (): Promise<LogoutResponse> => {
    // Prevent duplicate in-flight logout requests
    if (activeLogoutRef.current) {
      return activeLogoutRef.current;
    }

    setIsLoggingOut(true);

    const logoutExecution = (async (): Promise<LogoutResponse> => {
      try {
        return await performClientLogout(localStorage);
      } finally {
        setAuthState({
          token: null,
          role: null,
          isAuthenticated: false,
          isAdmin: false,
        });

        setIsLoggingOut(false);
        activeLogoutRef.current = null;
      }
    })();

    activeLogoutRef.current = logoutExecution;
    return logoutExecution;
  };

  return (
    <AuthContext.Provider value={{ ...authState, login, logout, isLoggingOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
