import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { decodeToken, isTokenExpired } from '../utils/jwt';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('securelearn_token') || null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize and validate auth state from token
  useEffect(() => {
    if (token) {
      if (isTokenExpired(token)) {
        logout();
      } else {
        const decoded = decodeToken(token);
        const storedUserRaw = localStorage.getItem('securelearn_user');
        let storedUser = null;
        if (storedUserRaw) {
          try { storedUser = JSON.parse(storedUserRaw); } catch (e) { /* ignore */ }
        }

        setUser({
          userId: storedUser?.userId || decoded?.userId || decoded?.id || decoded?.sub || 1,
          name: storedUser?.name || decoded?.name || (decoded?.sub ? decoded.sub.split('@')[0] : 'Learner'),
          email: storedUser?.email || decoded?.sub || decoded?.email || 'user@example.com',
          ...storedUser,
        });
      }
    } else {
      setUser(null);
    }
    setLoading(false);
  }, [token]);

  const login = useCallback((authData) => {
    // authData can be string (token) or object { token, userId, name, email }
    const jwtToken = typeof authData === 'string' ? authData : authData.token;
    if (!jwtToken) return;

    localStorage.setItem('securelearn_token', jwtToken);

    let userInfo = {};
    if (typeof authData === 'object') {
      const { token: _, ...rest } = authData;
      userInfo = rest;
    }

    const decoded = decodeToken(jwtToken);
    const resolvedUser = {
      userId: userInfo.userId || decoded?.userId || decoded?.id || decoded?.sub || 1,
      name: userInfo.name || decoded?.name || (decoded?.sub ? decoded.sub.split('@')[0] : 'Learner'),
      email: userInfo.email || decoded?.sub || decoded?.email || 'user@example.com',
      ...userInfo,
    };

    localStorage.setItem('securelearn_user', JSON.stringify(resolvedUser));
    setUser(resolvedUser);
    setToken(jwtToken);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('securelearn_token');
    localStorage.removeItem('securelearn_user');
    setToken(null);
    setUser(null);
  }, []);

  const value = {
    token,
    user,
    isAuthenticated: Boolean(token && !isTokenExpired(token)),
    loading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
