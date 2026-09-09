import { createContext, useContext, useEffect, useState } from 'react';
import {
  login as apiLogin,
  requestOTP as apiRequestOTP,
  setAuthToken,
} from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');

    if (token) {
      setAuthToken(token);

      if (savedUser) {
        setUser(JSON.parse(savedUser));
      } else {
        setUser({
          email: localStorage.getItem('user_email'),
        });
      }
    }

    setLoading(false);
  }, []);

  const requestOTP = async (email) => {
    return await apiRequestOTP(email);
  };

  const login = async (email, otp) => {
    const data = await apiLogin(email, otp);

    setUser(data.user);

    return data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user_email');
    localStorage.removeItem('user');

    setAuthToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        requestOTP,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);