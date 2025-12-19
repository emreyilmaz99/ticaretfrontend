import React, { createContext, useState, useContext, useEffect } from 'react';
import { registerUser, loginUser, logoutUser, getUserProfile } from '../features/user/api/userAuthApi';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    // Check for existing token and fetch user data - SADECE BİR KEZ
    if (authChecked) return;
    
    const checkAuth = async () => {
      const token = localStorage.getItem('auth_token');
      const userType = localStorage.getItem('user_type');
      if (token && userType === 'user') {
        try {
          const response = await getUserProfile();
          if (response.success && response.data?.user) {
            setUser(response.data.user);
          } else if (response.data) {
            setUser(response.data);
          } else {
            // Token invalid, clear it
            localStorage.removeItem('auth_token');
            localStorage.removeItem('user_type');
          }
        } catch (error) {
          // Token expired or invalid
          console.error('[AuthContext] Token validation failed:', error);
          localStorage.removeItem('auth_token');
          localStorage.removeItem('user_type');
        }
      }
      setLoading(false);
      setAuthChecked(true);
    };

    checkAuth();
  }, [authChecked]);

  const register = async (userData) => {
    try {
      const response = await registerUser({
        name: userData.name,
        email: userData.email,
        password: userData.password,
        password_confirmation: userData.password_confirmation || userData.password,
        phone: userData.phone || null,
      });

      if (response.success && response.data?.user) {
        // Token already saved by registerUser API
        setUser(response.data.user);
        return { success: true, message: response.message };
      }
      
      return { success: false, message: response.message || 'Kayıt başarısız.' };
    } catch (error) {
      console.error('[AuthContext] Register error:', error.response?.data);
      const message = error.response?.data?.message || 'Kayıt işlemi başarısız.';
      return { success: false, message };
    }
  };

  const login = async (email, password) => {
    try {
      const response = await loginUser(email, password);
      
      if (response.success && response.data?.user) {
        // Token already saved by loginUser API
        setUser(response.data.user);
        return { success: true };
      }

      return { success: false, message: response.message || 'Giriş başarısız.' };
    } catch (error) {
      console.error('[AuthContext] Login error:', error.response?.data);
      const message = error.response?.data?.message || 'Giriş işlemi başarısız.';
      return { success: false, message };
    }
  };

  const logout = async () => {
    try {
      await logoutUser();
    } catch (error) {
      // Ignore logout errors
    } finally {
      setUser(null);
      // Token cleanup already done by logoutUser API
    }
  };

  const refreshUser = async () => {
    try {
      // Profil endpoint'ini kullan - daha detaylı user bilgisi döner
      const response = await getUserProfile();
      console.log('[AuthContext] refreshUser response:', response);
      if (response.success && response.data?.user) {
        console.log('[AuthContext] User güncellendi:', response.data.user);
        setUser(response.data.user);
      } else if (response.data) {
        // Bazı endpoint'ler direkt user objesini döndürür
        console.log('[AuthContext] User güncellendi (direkt):', response.data);
        setUser(response.data);
      }
    } catch (error) {
      console.warn('[AuthContext] refreshUser failed:', error);
    }
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, register, logout, loading, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export default AuthContext;