import { getUserVipPosts } from "@/api/postApi";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface VipPostState {
  vipPurchasePosts: any[];
  loading: boolean;
  error: string | null;
  fetchUserVipPosts: () => Promise<void>;
  clearVipPosts: () => void;
}

export const useVipPostStore = create<VipPostState>()(
  persist(
    (set) => ({
      vipPurchasePosts: [],
      loading: false,
      error: null,

      fetchUserVipPosts: async () => {
        try {
          set({ loading: true, error: null });
          const data = await getUserVipPosts();
          set({ vipPurchasePosts: data, loading: false });
        } catch (error: any) {
          set({ error: error.message, loading: false });
        }
      },

      clearVipPosts: () => set({ vipPurchasePosts: [] }),
    }),
    {
      name: "vip-posts-storage", // storage key
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);