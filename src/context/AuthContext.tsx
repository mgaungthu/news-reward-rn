import { getCurrentUser, loginUser, logoutUser } from "@/api/authApi";
import { useFavoritesStore } from "@/store/useFavoritesStore";
import { useVipPostStore } from "@/store/useVipPostStore";
import { getDeviceId } from "@/utils/deviceId";
import * as SecureStore from "expo-secure-store";
import React, { createContext, useContext, useEffect, useState } from "react";


interface AuthContextType {
  token: string | null;
  user: any | null;
  isLoggedIn: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  getUser: () => Promise<void>;
  setisVerify: (value: boolean) => void;
}

const AuthContext = createContext<AuthContextType>({
  token: null,
  user: null,
  isLoggedIn: false,
  loading: true,
  login: async () => {},
  logout: async () => {},
  getUser: async () => {},
  setisVerify: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isVerify, setisVerify] = useState<boolean | null>(false);
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const { clearVipPosts } = useVipPostStore();
  const { clearFavorites } = useFavoritesStore();

  // Check stored token on app start
  useEffect(() => {
    const loadAuth = async () => {
      const savedToken = await SecureStore.getItemAsync("accessToken");
      const savedUser = await SecureStore.getItemAsync("user");
      const is_verify = await SecureStore.getItemAsync("is_verify");
      if (savedToken) setToken(savedToken);
      if (savedUser) setUser(JSON.parse(savedUser));
      if (is_verify === 'ok') setisVerify(true);
      setLoading(false);
    };
    loadAuth();
  }, []);

  const storeAuthData = async (token: string, user: any) => {
    await SecureStore.setItemAsync("accessToken", token);
    await SecureStore.setItemAsync("user", JSON.stringify(user));
  };

  // Login logic
  const login = async (email: string, password: string) => {
    const deviceId = await getDeviceId();
    const res = await loginUser({ email, password, device_id: deviceId });
    console.log("LOGIN RESPONSE:", res?.user.email_verified_at);

    // If user not verified → return error to component
    if (!res?.user.email_verified_at) {
      await storeAuthData(res.token, res.user);
      setisVerify(false);
      setToken(res.token);
      setUser(res.user || null);
      throw new Error("email_not_verified");
    }

    // Normal login
    await storeAuthData(res.token, res.user);
    await SecureStore.setItemAsync("is_verify", 'ok');
    setisVerify(true);
    setToken(res.token);
    setUser(res.user || null);
  };

  // Logout logic
  const logout = async () => {
    await logoutUser().catch(() => null);
    clearVipPosts();
    clearFavorites();
    await SecureStore.deleteItemAsync("accessToken");
    await SecureStore.deleteItemAsync("user");
    await SecureStore.deleteItemAsync("is_verify");
    setToken(null);
    setUser(null);
    setisVerify(false);
  };

  const getUser = async () => {
    try {
      const res = await getCurrentUser();
      setUser(res.user);
      await SecureStore.setItemAsync("user", JSON.stringify(res.user));
      return res.user;
    } catch (error) {
      logout()
      console.error("Error fetching user info:", error);
    }
  };

  const isLoggedIn = !!token && isVerify === true;

  return (
    <AuthContext.Provider
      value={{ token, user, isLoggedIn, loading, login, logout, getUser, setisVerify }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for easy usage
export const useAuth = () => useContext(AuthContext);
