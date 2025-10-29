import { useSettingsStore } from "@/store/settingsSlice";
import React, { useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { BannerAd, BannerAdSize } from "react-native-google-mobile-ads";

// ✅ Google Ad Manager (GAM) ad unit ID format: /networkId/adUnitName
const adUnitId = __DEV__ ? "/6499/example/banner" : "/YOUR_NETWORK_ID/YOUR_BANNER_UNIT";



export const BannerAdComponent = () => {
  const [loaded, setLoaded] = useState(false);

      const { ad_banner_id} =
      useSettingsStore();

  return (
    <View style={{ alignItems: "center", minHeight: 60 }}>
      {!loaded && <ActivityIndicator />}
      <BannerAd
        unitId={ad_banner_id}
        size={BannerAdSize.BANNER}
        onAdLoaded={() => setLoaded(true)}
        onAdFailedToLoad={(error) =>
          console.warn("❌ [GAM] Banner failed to load:", error)
        }
        requestOptions={{
          requestNonPersonalizedAdsOnly: true,
        }}
      />
    </View>
  );
};