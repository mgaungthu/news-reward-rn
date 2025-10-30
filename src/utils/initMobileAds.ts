import { useSettingsStore } from "@/store/settingsSlice";
import { Platform } from "react-native";
import mobileAds, { MaxAdContentRating } from "react-native-google-mobile-ads";

export const initMobileAds = async () => {
  try {
    // const res = await axios.get("https://yourapi.com/api/ad-settings");
    // const { android_app_id, ios_app_id } = res.data.data;
    const { android_app_id, ios_app_id } = useSettingsStore.getState();

    const appId = Platform.select({
      ios: ios_app_id,
      android: android_app_id,
    });

    console.log("[GAM] Using App ID from settings:", appId);

    // ✅ initialize without args (SDK reads manifest automatically)
    await mobileAds()
      .setRequestConfiguration({
        maxAdContentRating: MaxAdContentRating.PG,
        tagForChildDirectedTreatment: false,
      })
      .then(() => mobileAds().initialize());

    console.log("[GAM] Mobile Ads initialized successfully");
  } catch (error) {
    console.error("[GAM] Initialization failed:", error);
  }
};