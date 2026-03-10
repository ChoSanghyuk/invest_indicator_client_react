import { createContext, useState, useEffect } from 'react';
import { login as loginService, storeToken, clearToken, isAuthenticated } from '../services/auth.service';
import API_CONFIG from '../config/api.config';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [isAuth, setIsAuth] = useState(isAuthenticated());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check authentication status on mount
    setIsAuth(isAuthenticated());
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    try {
      const response = await loginService(credentials);
      storeToken(response.token, response.expiry);
      setIsAuth(true);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    clearToken();
    setIsAuth(false);
  };

  const value = {
    isAuth,
    login,
    logout,
    loading,
    isMockMode: API_CONFIG.USE_MOCK
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
