

import axios from "axios";
import * as SecureStore from "expo-secure-store";

import { getDeviceId } from "@/utils/deviceId";
import { API_BASE_URL } from "@env";


const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
});



// Add request interceptor
axiosInstance.interceptors.request.use(
  async (config) => {
    const token = await SecureStore.getItemAsync("accessToken");
    const deviceId = await getDeviceId();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    config.headers["X-Device-Id"] = deviceId;

    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await SecureStore.deleteItemAsync("accessToken");
      // Optional: redirect to login
      console.log("Unauthorized - redirecting to login");
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;