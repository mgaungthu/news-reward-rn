import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type FavoritePost = {
  id: number | string;
  title: string;
  is_vip:boolean;
  excerpt?: string;
  feature_image: string;
  feature_image_url: string;
  created_at?: string;
};

type FavoritesState = {
  favorites: FavoritePost[];
  addFavorite: (post: FavoritePost) => void;
  removeFavorite: (id: FavoritePost["id"]) => void;
  isFavorite: (id: FavoritePost["id"]) => boolean;
  clearFavorites: () => void;
};

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favorites: [],
      addFavorite: (post) => {
        set((state) => {
          const alreadyExists = state.favorites.some(
            (fav) => fav.id === post.id
          );
          if (alreadyExists) {
            return state;
          }
          return { favorites: [post, ...state.favorites] };
        });
      },
      removeFavorite: (id) =>
        set((state) => ({
          favorites: state.favorites.filter((fav) => fav.id !== id),
        })),
      isFavorite: (id) => get().favorites.some((fav) => fav.id === id),
      clearFavorites: () => set({ favorites: [] }),
    }),
    {
      name: "favorites-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
