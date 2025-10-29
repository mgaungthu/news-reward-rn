import { loginUser, logoutUser } from "@/api/authApi";
import * as SecureStore from "expo-secure-store";
import React, { createContext, useContext, useEffect, useState } from "react";

interface AuthContextType {
  token: string | null;
  user: any | null;
  isLoggedIn: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  token: null,
  user: null,
  isLoggedIn: false,
  loading: true,
  login: async () => {},
  logout: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  // Check stored token on app start
  useEffect(() => {
    const loadAuth = async () => {
      const savedToken = await SecureStore.getItemAsync("accessToken");
      const savedUser = await SecureStore.getItemAsync("user");
      if (savedToken) setToken(savedToken);
      if (savedUser) setUser(JSON.parse(savedUser));
      setLoading(false);
    };
    loadAuth();
  }, []);

  // Login logic
  const login = async (email: string, password: string) => {
    const res = await loginUser({ email, password });
    await SecureStore.setItemAsync("accessToken", res.token);
    await SecureStore.setItemAsync("user", JSON.stringify(res.user));
    setToken(res.token);
    setUser(res.user || null);
  };

  // Logout logic
  const logout = async () => {
    await logoutUser().catch(() => null);
    await SecureStore.deleteItemAsync("accessToken");
    await SecureStore.deleteItemAsync("user");
    setToken(null);
    setUser(null);
  };

  const isLoggedIn = !!token;

  return (
    <AuthContext.Provider
      value={{ token, user, isLoggedIn, loading, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for easy usage
export const useAuth = () => useContext(AuthContext);
