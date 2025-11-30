import { create } from "zustand";

interface AdLoadingState {
  adLoading: boolean;
  setAdLoading: (loading: boolean) => void;
}

export const useAdLoadingStore = create<AdLoadingState>((set) => ({
  adLoading: true, // default loading true
  setAdLoading: (loading) => set({ adLoading: loading }),
}));