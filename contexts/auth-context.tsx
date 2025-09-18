"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, UserRole, AuthResponse, LoginRequest, SignupRequest } from '@/lib/types/api';
import { api, endpoints } from '@/lib/api-client';
import { toast } from 'sonner';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginRequest) => Promise<boolean>;
  signup: (userData: SignupRequest) => Promise<boolean>;
  logout: () => void;
  hasRole: (roles: UserRole[]) => boolean;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user;

  // Check if user has any of the specified roles
  const hasRole = (roles: UserRole[]): boolean => {
    if (!user) return false;
    return roles.includes(user.role);
  };

  // Login function
  const login = async (credentials: LoginRequest): Promise<boolean> => {
    try {
      setIsLoading(true);
      const response = await api.post<AuthResponse>(endpoints.auth.login, credentials);
      
      if (response.data.success && response.data.token) {
        localStorage.setItem('auth_token', response.data.token);
        
        // If user data is included in login response, use it
        if (response.data.user) {
          setUser(response.data.user);
          localStorage.setItem('user_data', JSON.stringify(response.data.user));
        } else {
          // Otherwise fetch user data
          await refreshUser();
        }
        
        toast.success('Login successful!');
        return true;
      }
      
      toast.error('Login failed');
      return false;
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error(error.response?.data?.message || 'Login failed');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Signup function
  const signup = async (userData: SignupRequest): Promise<boolean> => {
    try {
      setIsLoading(true);
      const response = await api.post<AuthResponse>(endpoints.auth.signup, userData);
      
      if (response.data.success) {
        toast.success('Account created successfully! Please login.');
        return true;
      }
      
      toast.error('Signup failed');
      return false;
    } catch (error: any) {
      console.error('Signup error:', error);
      toast.error(error.response?.data?.message || 'Signup failed');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    const redirectPath = user?.role === UserRole.VillagePerson ? '/login/citizen' : '/login/govt';
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    setUser(null);
    toast.info('Logged out successfully');
    window.location.href = redirectPath;
  };

  // Refresh user data
  const refreshUser = async (): Promise<void> => {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) return;

      // Try to fetch fresh user data from backend
      try {
        const response = await api.get(endpoints.auth.me);
        if (response.data.success && response.data.user) {
          setUser(response.data.user);
          localStorage.setItem('user_data', JSON.stringify(response.data.user));
          return;
        }
      } catch (apiError) {
        console.log('API call failed, using stored data');
      }

      // Fallback to stored user data
      const storedUser = localStorage.getItem('user_data');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error('Error refreshing user:', error);
      logout();
    }
  };

  // Initialize auth state on mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        if (token) {
          await refreshUser();
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        logout();
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated,
    login,
    signup,
    logout,
    hasRole,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook to use auth context
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// HOC for protected routes
export function withAuth<P extends object>(
  Component: React.ComponentType<P>,
  allowedRoles?: UserRole[]
) {
  return function AuthenticatedComponent(props: P) {
    const { isAuthenticated, isLoading, hasRole } = useAuth();

    if (isLoading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      );
    }

    if (!isAuthenticated) {
      window.location.href = '/login/govt';
      return null;
    }

    if (allowedRoles && !hasRole(allowedRoles)) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-red-600">Access Denied</h2>
            <p className="text-gray-600 mt-2">You don't have permission to access this page.</p>
          </div>
        </div>
      );
    }

    return <Component {...props} />;
  };
}
