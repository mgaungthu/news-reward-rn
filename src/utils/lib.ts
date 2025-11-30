import { useSettingsStore } from "@/store/settingsSlice";
import * as Device from "expo-device";
import { Dimensions, Platform } from "react-native";
import {
  InterstitialAd,
  RewardedAd,
  RewardedInterstitialAd,
} from "react-native-google-mobile-ads";

// Helper to safely get ad IDs at runtime
export const getAdIds = () => {
  const { ad_interstitial_id, ad_reward_id, ad_ri_id } =
    useSettingsStore.getState();
  return {
    ad_interstitial_id,
    ad_reward_id,
    ad_ri_id,
  };
};

export const createAds = () => {
  const { ad_interstitial_id, ad_reward_id, ad_ri_id } = getAdIds();

  console.log("[GAM] Loaded Ad IDs:", ad_interstitial_id, ad_reward_id, ad_ri_id);

  // Individual null checks
  const interstitial = ad_interstitial_id
    ? InterstitialAd.createForAdRequest(ad_interstitial_id, {
        requestNonPersonalizedAdsOnly: true,
      })
    : null;

  const rewarded = ad_reward_id
    ? RewardedAd.createForAdRequest(ad_reward_id, {
        requestNonPersonalizedAdsOnly: true,
      })
    : null;

  const rewardedInterstitial = RewardedInterstitialAd.createForAdRequest(
    ad_ri_id,
    { requestNonPersonalizedAdsOnly: true }
  );

  if (!ad_interstitial_id) {
    console.log("[GAM] No interstitial ID — interstitial disabled");
  }

  if (!ad_reward_id) {
    console.log("[GAM] No reward ID — rewarded ad disabled");
  }

  if (!ad_ri_id) {
    console.log("[GAM] No RI ID — RI disabled");
  }


  return { interstitial, rewarded, rewardedInterstitial };
};

export function isTablet() {
  const { width } = Dimensions.get("window");

  // iPad or Android tablet
  const isIpad =
    (Platform.OS === "ios" && width >= 768) ||
    Device.deviceType === Device.DeviceType.TABLET;

  return isIpad;
}
