import { useSettingsStore } from "@/store/settingsSlice";
import {
  InterstitialAd,
  RewardedAd
} from "react-native-google-mobile-ads";

// Helper to safely get ad IDs at runtime
export const getAdIds = () => {
  const { ad_interstitial_id, ad_reward_id } = useSettingsStore.getState();
  return {
    ad_interstitial_id,
    ad_reward_id
  };
};

export const createAds = () => {
  const { ad_interstitial_id, ad_reward_id } = getAdIds();

  console.log('[GAM] Loaded Ad IDs:', ad_interstitial_id, ad_reward_id);

  const interstitial = InterstitialAd.createForAdRequest(ad_interstitial_id, {
    requestNonPersonalizedAdsOnly: true,
  });

  const rewarded = RewardedAd.createForAdRequest(ad_reward_id, {
    requestNonPersonalizedAdsOnly: true,
  });

  return { interstitial, rewarded };
};