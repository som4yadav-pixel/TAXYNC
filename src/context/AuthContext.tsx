import React, { createContext, useContext, useState, ReactNode } from 'react';
import { AuthState, User } from '../types';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null
  });

  const login = async (email: string, password: string): Promise<boolean> => {
    // Mock authentication - always succeeds
    const mockUser: User = {
      id: '1',
      email,
      name: email.split('@')[0],
      phone: '+91 98765 43210',
      created_at: new Date().toISOString()
    };
    
    setAuthState({
      isAuthenticated: true,
      user: mockUser
    });
    
    return true;
  };

  const logout = () => {
    setAuthState({
      isAuthenticated: false,
      user: null
    });
  };

  const updateUser = (updatedFields: Partial<User>) => {
    if (authState.user) {
      setAuthState({
        ...authState,
        user: { ...authState.user, ...updatedFields }
      });
    }
  };

  return (
    <AuthContext.Provider value={{ ...authState, login, logout, updateUser }}>
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