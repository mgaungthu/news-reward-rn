import { useSettingsStore } from "@/store/settingsSlice";
import {
  InterstitialAd,
  RewardedAd
} from "react-native-google-mobile-ads";

const { ad_interstitial_id, ad_reward_id } = useSettingsStore.getState();

const INTERSTITIAL_ID = ad_interstitial_id;
const REWARDED_ID = ad_reward_id;

// Create ad instances with IDs from adsConfig
export const interstitial = InterstitialAd.createForAdRequest(INTERSTITIAL_ID, {
  requestNonPersonalizedAdsOnly: true,
});

export const rewarded = RewardedAd.createForAdRequest(REWARDED_ID, {
  requestNonPersonalizedAdsOnly: true,
});

// Re-export enums for convenience
// export { AdEventType, RewardedAdEventType }