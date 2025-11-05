import axiosInstance from "@/api/axiosInstance";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from "react-native";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export interface SettingsState {
  points_per_claim: string;
  ad_banner_id: string;
  ad_interstitial_id: string;
  ad_reward_id: string;
  ad_app_open_id: string;
  ad_banner: string;
  banner_image: string;
  android_app_id: string;
  ios_app_id: string;
  loading: boolean;
  error: string | null;
  fetchSettings: () => Promise<void>;
  setSettings: (settings: Partial<SettingsState>) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      points_per_claim: "0",
      ad_banner_id: "",
      ad_interstitial_id: "",
      ad_reward_id: "",
      ad_app_open_id: "",
      ad_banner: "",
      banner_image: "",
      android_app_id: "",
      ios_app_id: "",
      loading: false,
      error: null,
      fetchSettings: async () => {
        set({ loading: true, error: null });
        try {
          const res = await axiosInstance.get("/settings");
          const data = res.data.data;

          const platformSettings =
            Platform.OS === "android"
              ? {
                  ad_banner_id: data.ad_banner_id_android || "",
                  ad_interstitial_id: data.ad_interstitial_id_android || "",
                  ad_reward_id: data.ad_reward_id_android || "",
                  ad_app_open_id: data.ad_app_open_id_android || "",
                }
              : {
                  ad_banner_id: data.ad_banner_id_ios || "",
                  ad_interstitial_id: data.ad_interstitial_id_ios || "",
                  ad_reward_id: data.ad_reward_id_ios || "",
                  ad_app_open_id: data.ad_app_open_id_ios || "",
                };

          set({
            ...data,
            ...platformSettings,
            loading: false,
          });
        } catch (err: any) {
          set({ loading: false, error: err.response?.data || err.message });
        }
      },
      setSettings: (settings) => set(settings),
    }),
    {
      name: "settings-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);