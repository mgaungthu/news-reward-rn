import axiosInstance from "@/api/axiosInstance";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export interface SettingsState {
  points_per_claim: string;
  ad_banner_id: string;
  ad_interstitial_id: string;
  ad_reward_id: string;
  ad_app_open_id: string;
  ad_banner: string;
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
      loading: false,
      error: null,
      fetchSettings: async () => {
        set({ loading: true, error: null });
        try {
          const res = await axiosInstance.get("/settings");
          set({ ...res.data.data, loading: false });
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