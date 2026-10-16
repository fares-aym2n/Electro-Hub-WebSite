import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authService } from '../services/authService';
import { tokenStorage } from '../services/apiClient';
import type { ApiUser, LoginRequest, RegisterRequest, RegisterResponse } from '../types/api';

export type AuthModalMode = 'signin' | 'signup' | 'forgot';

interface AuthContextType {
  user: ApiUser | null;
  token: string | null;
  isLoading: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<RegisterResponse>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  isAuthModalOpen: boolean;
  authModalMode: AuthModalMode;
  openAuthModal: (mode?: AuthModalMode) => void;
  closeAuthModal: () => void;
  setAuthModalMode: (mode: AuthModalMode) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<ApiUser | null>(null);
  const [token, setToken] = useState<string | null>(authService.getToken());
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalMode, setAuthModalMode] = useState<AuthModalMode>('signin');

  const openAuthModal = useCallback((mode: AuthModalMode = 'signin') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  }, []);

  const closeAuthModal = useCallback(() => {
    setIsAuthModalOpen(false);
  }, []);

  // Restore authenticated session via backend cookie
  const refreshUser = useCallback(async () => {
    try {
      setIsLoading(true);
      const profile = await authService.getMe();
      setUser(profile);
      setToken(authService.getToken() || (profile ? 'cookie-session' : null));
    } catch {
      // Unauthenticated visitor or session expired
      setUser(null);
      setToken(null);
      tokenStorage.remove();
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const login = async (credentials: LoginRequest) => {
    setIsLoading(true);
    try {
      const data = await authService.login(credentials);
      setToken(data.token);
      const profile = await authService.getMe();
      setUser(profile);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterRequest) => {
    return authService.register(data);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    authService.logout();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token: token || (user ? 'cookie-session' : null),
        isLoading,
        login,
        register,
        logout,
        refreshUser,
        isAuthModalOpen,
        authModalMode,
        openAuthModal,
        closeAuthModal,
        setAuthModalMode,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const useAuthModal = () => {
  const { isAuthModalOpen, authModalMode, openAuthModal, closeAuthModal, setAuthModalMode } = useAuth();
  return {
    isOpen: isAuthModalOpen,
    mode: authModalMode,
    openAuthModal,
    closeAuthModal,
    setAuthModalMode,
  };
};
