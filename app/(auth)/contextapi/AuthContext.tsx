"use client";
import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { apiService } from '@/lib/api';

interface User {
  id: number;
  email: string;
  first_name?: string;
  last_name?: string;
  name?: string; // Keep for backward compatibility if API returns it
  photo?: string;
  profile_image?: string;
  address?: string;
  contact_number?: string;
  birthday?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, first_name: string, last_name: string) => Promise<void>;
  logout: () => void;
  updateUser: (formData: FormData) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const userData = await apiService.getUserDetails();
          // Ensure photo field is set from profile_image if API returns it
          const userWithPhoto = {
            ...userData,
            photo: userData.photo || userData.profile_image,
          };
          setUser(userWithPhoto);
        } catch (error) {
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    };
    loadUser();
  }, []);

  const login = async (email: string, password: string) => {
    const response = await apiService.login(email, password);
    if (response.token || response.access_token || response.access) {
      const token = response.token || response.access_token || response.access;
      localStorage.setItem('token', token);
      const userData = await apiService.getUserDetails();
      // Ensure photo field is set from profile_image if API returns it
      const userWithPhoto = {
        ...userData,
        photo: userData.photo || userData.profile_image,
      };
      setUser(userWithPhoto);
    } else {
      throw new Error('No token received from server');
    }
  };

  const signup = async (email: string, password: string, first_name: string, last_name: string) => {
    // First, create the user account
    await apiService.signup({ email, password, first_name, last_name });
    
    // After successful signup, automatically log in the user
    // Some APIs don't return a token on signup, so we use login instead
    await login(email, password);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

 const updateUser = async (formData: FormData) => {
  const updatedUser = await apiService.updateUser(formData);
  // Ensure photo field is set from profile_image if API returns it
  const userWithPhoto = {
    ...updatedUser,
    photo: updatedUser.photo || updatedUser.profile_image,
  };
  setUser(userWithPhoto);
};




  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, updateUser }}>
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

