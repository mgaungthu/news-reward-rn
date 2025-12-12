import axios from "axios";
import * as SecureStore from "expo-secure-store";

import { getDeviceId } from "@/utils/deviceId";
import { API_BASE_URL, API_CLIENT_ID, API_CLIENT_KEY } from "@env";


const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
});

console.log(API_BASE_URL,API_CLIENT_ID,API_CLIENT_KEY, 'api base url')

// Add request interceptor
axiosInstance.interceptors.request.use(
  async (config) => {
    const token = await SecureStore.getItemAsync("accessToken");
    const deviceId = await getDeviceId();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    config.headers["X-Device-Id"] = deviceId;
    config.headers["X-Client-Id"] = API_CLIENT_ID;
    config.headers["X-Api-Key"] = API_CLIENT_KEY;

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