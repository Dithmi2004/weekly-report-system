import { createContext, useEffect, useState } from "react";
import { loginUser, getUserProfile, logoutUser } from "../api/authApi";
import {
  saveUser,
  getUser,
  clearAuthStorage,
} from "../utils/tokenStorage";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(getUser());
  const [loading, setLoading] = useState(true);

  const isAuthenticated = Boolean(user);

  const login = async (credentials) => {
    const response = await loginUser(credentials);

    clearAuthStorage();
    saveUser(response.user);
    setUser(response.user);

    return response.user;
  };

  const logout = async () => {
    try {
      await logoutUser();
    } catch (error) {
    }

    clearAuthStorage();
    setUser(null);
    window.location.href = "/login";
  };

  const loadUser = async () => {
    try {
      const response = await getUserProfile();
      saveUser(response.data);
      setUser(response.data);
    } catch (error) {
      clearAuthStorage();
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
