import React, { createContext, useContext, useState, useEffect } from 'react';

interface AuthState {
  token: string | null;
  role: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

interface AuthContextType extends AuthState {
  login: (token: string, role: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    token: null,
    role: null,
    isAuthenticated: false,
    isAdmin: false,
  });

  useEffect(() => {
    // Initialize state from localStorage
    const storedToken = localStorage.getItem('token');
    const storedRole = localStorage.getItem('role');

    if (storedToken && storedRole) {
      setAuthState({
        token: storedToken,
        role: storedRole,
        isAuthenticated: true,
        isAdmin: storedRole === 'admin' || storedRole === 'super_admin',
      });
    }
  }, []);

  const login = (token: string, role: string) => {
    localStorage.setItem('token', token);
    localStorage.setItem('role', role);
    setAuthState({
      token,
      role,
      isAuthenticated: true,
      isAdmin: role === 'admin' || role === 'super_admin',
    });
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setAuthState({
      token: null,
      role: null,
      isAuthenticated: false,
      isAdmin: false,
    });
  };

  return (
    <AuthContext.Provider value={{ ...authState, login, logout }}>
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
